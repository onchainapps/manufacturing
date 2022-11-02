import { LoginUser } from "../generated-typings";
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const loginUser: LoginUser = async( userName, password ) => {
  if(userName == "") return({"error": "blank"});
  if(password == "") return({"error": "blank"});

  const loginRes: any = await login( userName, password );
  return( loginRes );
};

const login = async (userName: string, password: string ) => {
  const db: any = await open({
    filename: './db/cb.db',
    driver: sqlite3.Database
  });

  const getUserSQL: string = 'SELECT * FROM Account WHERE userName=?';
  try{
    const checkAccountRes: any = await db.get( getUserSQL, [ userName ]);
    // console.log(checkAccountRes);

    if(typeof checkAccountRes == "undefined") db.close();
    if(typeof checkAccountRes == "undefined") return("noAccount");

    // console.log(checkAccountRes.accountPassword);
    const passCheck: any = await bcrypt.compare(password, checkAccountRes.password);
    if( passCheck == false ) db.close();
    if( passCheck == false ) return("authError");
    
    const token = jwt.sign(
      {
        accountName: userName,
      }, checkAccountRes.password
    );
    db.close();
    return({ token });
  }catch( error ){
    console.log( error );
    return( error );
  }
};

export default loginUser;
