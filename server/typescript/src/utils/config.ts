import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export const getConfig = async () => {
    const db = await open({
        filename: './db/cb.db',
        driver: sqlite3.Database
    });
      
    try{
        const SQLGetConfig: string = 'SELECT * FROM Config';
        const configRes: any = await db.get( SQLGetConfig );
        console.log( configRes );
        db.close();
        return(configRes);
    }catch(error){
        console.log(error);
    }

};

