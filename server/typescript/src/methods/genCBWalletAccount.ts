import { GenCBWalletAccount } from "../generated-typings";
import { genAccountKeyPrv, genUTXOKey, genStakeKey, genBaseAddr, genEnterpriseAddr, genPointerAddr, genRewardAddr } from "../utils/wallet";
import CardanoWasm = require('@emurgo/cardano-serialization-lib-nodejs')
import { getConfig } from "../utils/config";
import { decrypt, encrypt } from "../utils/crypt";
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { checkJWT } from "../utils/checkauth";

const genCBWalletAccount: GenCBWalletAccount = ( jwToken, userName, walletID, accountName, walletPassPhrase ) => {
  return new Promise( async ( resolve, reject ) =>{
    const checkToken: any = await checkJWT(jwToken, userName);
    if( checkToken.name ) return resolve("authError");

    // open the database
    const db = await open({
      filename: './db/cb.db',
      driver: sqlite3.Database
    });
    const config: any = await getConfig();
    const network: string = config.network;  
    resolve(genAccount( db, walletID, accountName, walletPassPhrase, network ));
  });
};

const genAccount = async ( db: any, walletID: any, accountName: string, walletPassPhrase: string, network: any ):Promise<any> => {
  const purpose: number = 1852;
  const coinType: number = 1815;
  let accIndex: number;
  const net = network == "mainnet" ? 1 : 0;
  const time: any  = Math.floor(Date.now() / 1000);

  try{  
    const SQLAccIndex: string = 'SELECT accountIndex FROM WalletAccounts WHERE walletID = ? ORDER BY accountIndex DESC';
    const accountIndexRes: any = await db.get( SQLAccIndex, [ walletID ] );

    typeof accountIndexRes == "undefined" ? accIndex = 0 : accIndex = accountIndexRes.accountIndex+1
    console.log( "account index: " + accIndex );

    const SQLgetWalletRoot: string = 'SELECT walletRootKey FROM Wallets WHERE walletID = ?';
    const walletRootEncryped: any = await db.get( SQLgetWalletRoot, [ walletID ] );
    // console.log(accKeyEncryped);

    const keyDecrepty: any = await decrypt( walletPassPhrase, walletRootEncryped.walletRootKey );
    const walletRoot: any = CardanoWasm.Bip32PrivateKey.from_bech32(keyDecrepty);

    const accountKeyPrv: any = await genAccountKeyPrv(walletRoot, purpose, coinType, accIndex);
    const accKeyEncrypted: string = await encrypt( walletPassPhrase, accountKeyPrv.to_bech32() );
    // console.log(`accountKeyPrv raw: ${accountKeyPrv}`);
    // console.log(`accountKeyPrv to bech32: ${accountKeyPrv.to_bech32()}`);
    // console.log(`accountKeyPrv from bech32: ${accountKeyPrv.from_bech32()}`);

    const utxoKey: any = await genUTXOKey( accountKeyPrv, 0 );
    // console.log(utxoKey);
    // console.log("utxo key " + utxoKey.to_public().to_bech32());

    const stakeKey = await genStakeKey( accountKeyPrv, 0 );
    console.log("stake key: " + stakeKey.to_public().to_bech32());

    const baseAddr = await genBaseAddr( net,  utxoKey.to_public(), stakeKey.to_public() );
    // console.log(baseAddr.to_address().to_bech32());

    const enterpriseAddr = await genEnterpriseAddr( net,  utxoKey.to_public() );
    // console.log(enterpriseAddr.to_address().to_bech32());

    const pointerAddr = await genPointerAddr( net,  utxoKey.to_public() );
    // console.log(pointerAddr.to_address().to_bech32());

    const rewardAddr = await genRewardAddr( net, stakeKey.to_public() ); 
    console.log(rewardAddr.to_address().to_bech32());
    
    const SqlCheckAccName: any = 'SELECT accountName FROM WalletAccounts WHERE walletID=? AND accountName=? ';
    const checkAccName: any = await db.get( SqlCheckAccName, [ walletID, accountName ] );
    console.log(accountName);
    console.log(typeof checkAccName);
    if(typeof checkAccName == "object" ){
      db.close(); 
      return("account name exists");
    }

    const SQLSaveAccount = `INSERT INTO WalletAccounts           ( walletID, accountName, accountIndex, accountKeyPrv, baseAddr, enterpriseAddr, pointerAddr, rewardAddr, network, timeCreated ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )`;
    const SQLSaveAccountRes: any = await db.run( SQLSaveAccount, [ walletID, accountName, accIndex, accKeyEncrypted, baseAddr.to_address().to_bech32(), enterpriseAddr.to_address().to_bech32(), pointerAddr.to_address().to_bech32(), rewardAddr.to_address().to_bech32(), network, time ] );
    // console.log(SQLSaveAddressRes);
    db.close();
    return("ok");
  }catch( error ){
    console.log( error );
    return( error );
  };
};

export default genCBWalletAccount;
