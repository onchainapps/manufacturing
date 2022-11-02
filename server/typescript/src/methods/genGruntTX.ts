import { GenGruntTX } from "../generated-typings";
import { checkJWT } from "../utils/checkauth";
import { gruntTX } from "../utils/txbuilder";
import { encrypt, decrypt } from "../utils/crypt";
import { genUTXOKey } from "../utils/wallet";
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import CardanoWasm = require('@emurgo/cardano-serialization-lib-nodejs')

const genGruntTX: GenGruntTX = ( jwToken, userName, walletID, walletPass, accountName, utxos, assets, metadata, outputs, changeAddress, txTTL ) => {
  return new Promise( async ( resolve, reject ) => {
    const checkToken: any = await checkJWT( jwToken, userName );
    if( checkToken.name ) return resolve("authError");

    // open the database
    const db = await open({
      filename: './db/cb.db',
      driver: sqlite3.Database
    });

    const SQLgetKey: string = 'SELECT accountKeyPrv FROM WalletAccounts WHERE walletID = ? AND accountName = ?';
    try{
      const accKeyEncryped: any = await db.get( SQLgetKey, [ walletID, accountName ] );
      // console.log(accKeyEncryped);
      const keyDecrepty: any = await decrypt( walletPass, accKeyEncryped.accountKeyPrv );
      const accountKey: any = CardanoWasm.Bip32PrivateKey.from_bech32( keyDecrepty );
      const utxoKey: any = await genUTXOKey( accountKey, 0 );
      // console.log(utxos);
      // console.log(assets);
      // console.log(metadata);
      // console.log(utxoKey)
      console.log(outputs);
      const gruntTxResult = await gruntTX( utxoKey, utxos, assets, metadata, outputs, changeAddress, Number(txTTL) );
      resolve( gruntTxResult );
    }catch( error ){
      console.log( error );
      return resolve( error );
    }
  });
};

export default genGruntTX;

