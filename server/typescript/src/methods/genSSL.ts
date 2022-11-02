import { GenSSL } from "../generated-typings";
const exec = require('child_process').execSync;
import { checkJWT } from "../utils/checkauth";

const genSSL: GenSSL = (jwToken, userName, sslCommonName, sslCountry, sslLocation, sslOrg) => {
  return new Promise( async(resolve, reject) => {
    const checkToken: any = await checkJWT( jwToken, userName );
    if( checkToken.name ) return resolve("authError");

    const buildSSLCertRes: any = buildSSLcert(sslCommonName, sslCountry, sslLocation, sslOrg);
    resolve(buildSSLCertRes);
    return;
  });
};

export const buildSSLcert = async ( sslCommonName: string, sslCountry: string, sslLocation: string, sslOrg: string ) => { 
  const genSSLcmd: string = `openssl req -new -newkey rsa:4096 -days 365 -nodes -x509 -subj "/C=${sslCountry}/ST=blockchain/L=${sslLocation}/O=${sslOrg}/CN=${sslCommonName}" -addext "subjectAltName = DNS:${sslCommonName}" -keyout cert/server.key -out cert/server.cert`
  console.log(await exec( genSSLcmd , { "encoding":"utf8" } ));
  return("ok")
};

export default genSSL;
