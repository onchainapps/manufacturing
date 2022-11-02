import jwt from "jsonwebtoken";
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export const checkJWT = async ( token: string, userName: string ) => {
  // console.log(token);
  const db: any = await open({
    filename: './db/cb.db',
    driver: sqlite3.Database
  });
  const getUserSQL: string = 'SELECT password FROM Account WHERE userName=?';
  return new Promise(async (resolve,reject) =>{
    try {
      const getAccHash: any = await db.get( getUserSQL, [ userName ] );
      // console.log(getAccHash.accountPassword);
      db.close();
      const checkToken: any = jwt.verify(token, getAccHash.password);
      // console.log(checkToken);
      resolve(checkToken);
    } catch ( error ) {
      // console.log( error );
      resolve(error);
    };
  });
};
