import { ResetUser } from "../generated-typings";
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
const execAwait = require('child_process').execSync;

const resetUser: ResetUser = () => {
  return new Promise( async (resolve, reject) => {
    // open the database
    const db = await open({
      filename: './db/cb.db',
      driver: sqlite3.Database
    });
    return await resolve( resetDB(db) );
  });
};

const resetDB = async ( db: any ) => {
  const sqlResetAccounts: string = "DELETE FROM Account";
  const sqlResetWallets: string = "DELETE FROM Wallets";
  const sqlResetWalletAccounts: string = "DELETE FROM WalletAccounts";
  const sqlResetBlockFrost: string = "UPDATE Config SET blockfrostApiKey=? WHERE id=1"
  const resetHostnameCMD: string = "sudo hostnamectl set-hostname spaceprinter";

  try{
    await db.run( sqlResetAccounts );
    await db.run( sqlResetWallets );
    await db.run( sqlResetWalletAccounts );
    await db.run( sqlResetBlockFrost, "" );
    await execAwait( resetHostnameCMD, { "encoding":"utf8" } );
    db.close();

    return("ok");
  }catch( error ){
    console.log(error);
    return(error);
  };
};

export default resetUser;
