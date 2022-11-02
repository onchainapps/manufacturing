import { DownloadFile } from "../generated-typings";
const exec = require('child_process').execSync;
import { checkJWT } from "../utils/checkauth";

const downloadFile: DownloadFile = (jwToken, userName, fileURL, fileName) => {
  return new Promise( async (resolve, reject) =>{
    const checkToken: any = await checkJWT(jwToken, userName);
    if( checkToken.name ) return resolve("authError");
    
    const downloadResult: any = download(fileURL, fileName);
    resolve(downloadResult);
  });
};

const download = async ( fileURL: string, fileName: string ) => {
  return console.log("Downloading")
};

export default downloadFile;
