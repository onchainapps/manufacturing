import { CreateUser } from "../generated-typings";
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from "bcrypt";

const createUser: CreateUser = async ( userName, password ) => {
  if(userName == "") return({"error": "blank"});
  if(password == "") return({"error": "blank"});
  
  const newUserRes: any = await newUser( userName, password );
  return(newUserRes);
};

const newUser: CreateUser = async ( userName, password ) => {
  const db: any = await open({
    filename: './db/cb.db',
    driver: sqlite3.Database
  });
  const passEncrypt: any = await bcrypt.hash( password, 10 );
  const timecreated: any  = Math.floor(Date.now() / 1000);
  const insertUserSQL: string = `INSERT INTO Account ( userName, password, timeCreated, sessionType ) VALUES (?, ?, ?, ?)`;
  const getUserSQL: string = 'SELECT userName FROM Account WHERE userName=?';
  try{
    const checkAccountRes: any = await db.get( getUserSQL, [ userName ] );
    // console.log(typeof checkAccountRes);
    
    if(typeof checkAccountRes !== "undefined") db.close();
    if(typeof checkAccountRes !== "undefined") return({"error":"Account Exists"});

    const queryDB: any = await db.run( insertUserSQL, [ userName, passEncrypt, timecreated, "" ] );
    db.close();
    return(queryDB);
  }catch( error ) {
    console.log(error);
    return(error);
  };
};

export default createUser;
