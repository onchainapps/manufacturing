import { ChangeDeviceName } from "../generated-typings";
const execAwait = require('child_process').execSync;
const exec = require('child_process').exec;
import { checkJWT } from "../utils/checkauth";
import { buildSSLcert } from "./genSSL"

const changeDeviceName: ChangeDeviceName = ( jwToken, userName, hostname ) => {
  return new Promise( async ( resolve, reject ) => {
    const checkToken: any = await checkJWT( jwToken, userName );
    if( checkToken.name ) return resolve("authError");

    resolve(changeName( hostname ));
  });
};

const changeName = async ( newHostname: string ) => {
  console.log("Changing Device name to: " + newHostname );

  const changeNameCmd: string = "sudo hostnamectl set-hostname " + newHostname; 
  const cmReboot: string = "sudo shutdown -r now";

  try{
    execAwait( changeNameCmd, { "encoding":"utf8" } );
    await buildSSLcert(newHostname+".local", "SL", "Underground", "ThePrinterPeople");
    setTimeout(
      ()=>{
        execAwait( cmReboot, { "encoding":"utf8" } );
      }, 5000 );
    return("ok");
  }catch( error ){
    console.log( error )
    return( error );
  };
};

export default changeDeviceName;
