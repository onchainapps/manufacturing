import { GenCBWallet } from "../generated-typings";
import { mnemonicToEntropy, generateMnemonic, validateMnemonic } from 'bip39';
import { genSeedPhrase, validateSeedPhrase, entropyToRoot, genAccountKeyPrv, genAccountKeyPub, genUTXOKey, genStakeKey, genBaseAddr } from "../utils/wallet";
import { getConfig } from "../utils/config";
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { encrypt, decrypt } from "../utils/crypt";
import { checkJWT } from "../utils/checkauth";

const genCBWallet: GenCBWallet =  ( jwToken, userName, walletName, seedPhrase, walletPassPhrase, walletType ) => {
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
    
    return await resolve(createWallet( db, network, walletName, seedPhrase, walletPassPhrase, walletType));
  });
};

const createWallet = async ( db: any, network: string, walletName: string, seedPhrase: any, walletPassPhrase: string, walletType: string ) => {
  let valSeed;
  let empty = false;
  let res;
  const timecreated: any  = Math.floor(Date.now() / 1000);

  // if no seed phrase provided generate one, use with creating a new wallet
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

    const rootKeyDencrypted: string = await decrypt(walletPassPhrase, rootKeyEncrypted);
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

    empty == true ? res = {
      "walletID": walletID,
      "seed": seedPhrase
    }
    : 
    res = "ok";

    db.close();
    return(res);
  }catch(error){
    console.log(error);
    return(error);
  };
};

export default genCBWallet;
