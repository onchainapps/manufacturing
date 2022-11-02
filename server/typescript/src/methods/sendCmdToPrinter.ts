import { SendCmdToPrinter } from "../generated-typings";
import { curly  } from 'node-libcurl';
import { checkJWT } from "../utils/checkauth";
const exec = require('child_process').execSync;

const sendCmdToPrinter: SendCmdToPrinter = ( jwToken, userName, gcode ) => {
  return new Promise( async ( resolve, reject ) => {
    const checkToken: any = await checkJWT(jwToken, userName);
    if( checkToken.name ) return resolve("authError");

    console.log(`Sending Command: ${gcode}`);
    const cmdResult: any = sendCMD( gcode );
    resolve(cmdResult);
  });
};

const sendCMD = async ( gcode: string ) => {
  const command: string = `echo ${gcode} > /dev/ttyUSB0`;
  console.log(command);
  try{
    const result: any = await exec( command , { "encoding":"utf8" } );
    console.log(result);
    return( result );
  }catch(error){
    console.log(error);
    return( error );
  };
};

export default sendCmdToPrinter;
