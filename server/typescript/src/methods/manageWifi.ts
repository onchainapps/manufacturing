import { ManageWifi } from "../generated-typings";
const execAwait = require('child_process').execSync;
const exec = require('child_process').exec;
import { checkJWT } from "../utils/checkauth";

const manageWifi: ManageWifi = (jwToken, userName, wifiAction, ssid, ssidPass) => {
  return new Promise( async (resolve, reject) => {
    const checkToken: any = await checkJWT(jwToken, userName);
    if( checkToken.name ) return resolve("authError");
    wifiAction === "scan"       && await resolve( scanWifi() );
    wifiAction === "connect"    && await resolve( connectWifi( ssid, ssidPass ) );
    wifiAction === "disconnect" && await resolve( disconnectWifi( ssid ) );
    wifiAction === "status"     && await resolve( statusWifi() );
  });
};

const scanWifi = async () => {
  console.log("Scanning WiFi");
  const cmdWifiOn: string = "sudo nmcli radio wifi on";
  const cmdWifiScan: string = "sudo iw dev wlan0 scan | jc --iw-scan";
  try{
    await execAwait( cmdWifiOn, { "encoding":"utf8" } );
    return(await execAwait( cmdWifiScan, { "encoding":"utf8" } ));
  }catch( error ){
    console.log( error )
    return( error );
  };
};

const connectWifi = async ( ssid: string, ssidPass: string ) => {
  console.log("Connecting to WiFi: " + ssid);
  const cmdConnWifi: string = `sudo nmcli dev wifi connect ${ssid} password ${ssidPass}`;
  try{
    return(await execAwait( cmdConnWifi, { "encoding":"utf8" } ));
  }catch( error ){
    console.log( error )
    return( error );
  };
};

const statusWifi = async ( ) => {
  console.log("WiFi status");
  const cmdStatusWifi: string = `iw dev wlan0 link | jc --iw-scan`;
  try{
    return(await execAwait( cmdStatusWifi, { "encoding":"utf8" } ));
  }catch( error ){
    console.log( error )
    return( error );
  };
};

const disconnectWifi = async ( ssid: string ) => {
  console.log("Disconnect from: " + ssid);
  const cmdDiconnect: string = `sudo nmcli con down ${ssid}`;
  const cmdRemove:    string = `sudo nmcli con del ${ssid}`;
  const cmdAvahi:     string = `sudo systemctl restart avahi-daemon.service`;
  try{
    exec( cmdDiconnect );
    exec( cmdAvahi) ;
    return(await execAwait( cmdRemove, { "encoding":"utf8" } ));
  }catch( error ){
    console.log( error )
    return( error );
  };
};

export default manageWifi;
