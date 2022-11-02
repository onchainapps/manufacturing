import { GenPrinterWallet } from "../generated-typings";
import { mnemonicToEntropy, generateMnemonic, validateMnemonic } from 'bip39';
import { genSeedPhrase, validateSeedPhrase, entropyToRoot, genAccountKeyPrv, genAccountKeyPub, genStakeKey, genUTXOKey, genBaseAddr, genEnterpriseAddr, genPointerAddr, genRewardAddr } from "../utils/wallet";
import { getConfig } from "../utils/config";
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { encrypt, decrypt } from "../utils/crypt";
import { checkJWT } from "../utils/checkauth";

const genPrinterWallet: GenPrinterWallet = async ( jwToken, userName, walletName, seedPhrase, walletPassPhrase, walletType ) => {
  console.log("Creating Printer Wallet");
  return new Promise( async (resolve, reject) => {
    const checkToken: any = await checkJWT(jwToken, userName);
    if( checkToken.name ) return resolve("authError");
    const config: any = await getConfig();
    const network: string = config.network;

    // open the database
    const db = await open({
      filename: './db/cb.db',
      driver: sqlite3.Database
    });
    
    const newWallet: any = await createWallet( db, network, walletName, seedPhrase, walletPassPhrase, walletType);
    // console.log( newWallet );
    resolve(newWallet);
  })
};

const createWallet = async ( db: any, network: string, walletName: string, seedPhrase: any, walletPassPhrase: string, walletType: string ) => {
  const purpose: number = 1852;
  const coinType: number = 1815;
  let valSeed;
  let empty = false;
  let res;
  const timecreated: any  = Math.floor(Date.now() / 1000);

  if (seedPhrase === "" ){ seedPhrase = await genSeedPhrase(); empty = true; };
  // console.log("new seed: " + seedPhrase)

  if (seedPhrase != "" ){ valSeed = await validateSeedPhrase(seedPhrase); };
  // console.log("val seed: " + valSeed)

  if ( valSeed == false ){ return("Invalid Seed"); };

  const entropy = await mnemonicToEntropy(seedPhrase);
  // console.log("Entropy: " + entropy);
  
  const rootKey = await entropyToRoot( entropy );
  // console.log(`rootkey: ${rootKey.to_bech32()}`);
    
  const rootKeyPub: any = await genAccountKeyPub( rootKey );
  console.log(`rootKeyPub: ${rootKeyPub.to_bech32()}`);
  // console.log(`rootKeyPub length: ${rootKeyPub.to_bech32().length}`);

  try{
    const walletID: any = rootKeyPub.to_bech32().slice( 100 ); //temp for testing
    // console.log(walletID);
    // console.log(walletID.length);

    const rootKeyEncrypted: string = await encrypt(walletPassPhrase, rootKey.to_bech32());
    // console.log(`prv encrypt: ${prvEncrypt}`);

    // const rootKeyDencrypted: string = await decrypt(walletPassPhrase, rootKeyEncrypted);
    // console.log(`prv decrypt: ${prvDecrypt}`);
    
    // check for wallet id if exists that means seed phrase has been used.
    const checkWalletID = await db.get('SELECT * FROM Wallets WHERE walletID = ?', [ walletID ] );
    // console.log(checkWalletID);
    if ( typeof checkWalletID !== "undefined") return({"error":"Wallet with seed phrase already exists"});

    // check for duplicated wallet name
    const checkWalletName = await db.get('SELECT * FROM Wallets WHERE walletName = ?' , [ walletName ] );
    // console.log(checkWalletName);
    if( typeof checkWalletName !== "undefined") return({"error":`Wallet name: ${walletName} exists`});

    const SQLSaveWallet = `INSERT INTO Wallets                 ( walletID, walletName, walletType, walletRootKey, timeCreated ) VALUES (?, ?, ?, ?, ?)`;
    const SQLSaveWalletRes: any = await db.run( SQLSaveWallet, [ walletID, walletName, walletType, rootKeyEncrypted, timecreated ] );
    // console.log(SQLSaveWalletRes);

    await genPrinterWalletAccount( db, walletID, walletName, walletPassPhrase, network, rootKey );

    empty == true ? res = {"seed": seedPhrase} : res = "ok";

    db.close();
    return(res);
  }catch(error){
    db.close();
    console.log(error);
    return(error);
  };
};

const genPrinterWalletAccount = async ( db: any, walletID: any, accountName: string, walletPassPhrase: string, network: any, rootKey: any ):Promise<any> => {
  const purpose: number = 1852;
  const coinType: number = 1815;
  let accIndex: number = 0;
  const net = network == "mainnet" ? 1 : 0;
  const time: any  = Math.floor(Date.now() / 1000);
  
  try{
    const accountKeyPrv: any = await genAccountKeyPrv(rootKey, purpose, coinType, accIndex);
    const accKeyEncrypted: string = await encrypt( walletPassPhrase, accountKeyPrv.to_bech32() );

    const utxoKey: any = await genUTXOKey( accountKeyPrv, 0 );
    // console.log(utxoKey);
    // console.log("utxo key " + utxoKey.to_public().to_bech32());

    const stakeKey = await genStakeKey( accountKeyPrv, 0 );
    // console.log("stake key: " + stakeKey.to_public().to_bech32());

    const baseAddr = await genBaseAddr( net,  utxoKey.to_public(), stakeKey.to_public() );
    // console.log(baseAddr.to_address().to_bech32());

    const enterpriseAddr = await genEnterpriseAddr( net,  utxoKey.to_public() );
    // console.log(enterpriseAddr.to_address().to_bech32());

    const pointerAddr = await genPointerAddr( net,  utxoKey.to_public() );
    // console.log(pointerAddr.to_address().to_bech32());

    const rewardAddr = await genRewardAddr( net, stakeKey.to_public() ); 
    // console.log(rewardAddr.to_address().to_bech32());
    
    const SqlCheckAccName: any = 'SELECT accountName FROM WalletAccounts WHERE walletID=? AND accountName=? ';
    const checkAccName: any = await db.get( SqlCheckAccName, [ walletID, accountName ] );
    console.log(accountName);
    console.log(typeof checkAccName);
    if(typeof checkAccName == "object" ){ 
      return("Printer account exists");
    }

    const SQLSaveAccount = `INSERT INTO WalletAccounts           ( walletID, accountName, accountIndex, accountKeyPrv, baseAddr, enterpriseAddr, pointerAddr, rewardAddr, network, timeCreated ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )`;
    const SQLSaveAccountRes: any = await db.run( SQLSaveAccount, [ walletID, accountName, accIndex, accKeyEncrypted, baseAddr.to_address().to_bech32(), enterpriseAddr.to_address().to_bech32(), pointerAddr.to_address().to_bech32(), rewardAddr.to_address().to_bech32(), network, time ] );
    // console.log(SQLSaveAddressRes);
    return("ok");
  
  }catch( error ){
    console.log( error );
    return( error );
  };
};

export default genPrinterWallet;
