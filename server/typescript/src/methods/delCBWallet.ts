import { DelCBWallet } from "../generated-typings";
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { checkJWT } from "../utils/checkauth";

const delCBWallet: DelCBWallet = ( jwToken, userName, walletID, accountName ) => {
  return new Promise( async (resolve, reject) => {
    const checkToken: any = await checkJWT( jwToken, userName );
    if( checkToken.name ) return resolve("authError");
    // open the database
    const db = await open({
      filename: './db/cb.db',
      driver: sqlite3.Database
    });
    accountName == "" ? resolve(delWallet( db, walletID )) : resolve(delWalletAccount( db, walletID, accountName ));
  });
};

const delWallet = async ( db: any, walletID: string ) => {
  try{
    const SQLdelWallet: string = 'DELETE FROM Wallets WHERE walletID=?';
    const resultDelWallets = await db.run(SQLdelWallet, [ walletID ] );
    console.log( resultDelWallets );
    const SQLdelWalletAcc: string = 'DELETE FROM WalletAccounts WHERE walletID=?';
    const delWalletAccRes = await db.run(SQLdelWalletAcc, [ walletID ] );
    console.log( delWalletAccRes );
    db.close();
    return( "ok" );
  }catch( error ){
    console.log(error);
    return( error );
  };
};

const delWalletAccount = async ( db: any, walletID: string, accountName: string ) => {
  try{
    const SQLdelWalletAcc: string = 'DELETE FROM WalletAccounts WHERE walletID=? AND accountName=?';
    const delWalletAccRes = await db.run(SQLdelWalletAcc, [ walletID, accountName ] );
    console.log( delWalletAccRes );
    db.close();
    return( "ok" );
  }catch( error ){
    console.log(error);
    return( error );
  };
};

export default delCBWallet;
