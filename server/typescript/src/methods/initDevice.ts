import { getConfig } from "../utils/config";
import fs from 'fs';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
const { exec } = require('child_process');
const serialport = require('serialport');
import { WebSocketServer } from 'ws';
import { createServer } from 'https';
import { buildSSLcert } from "./genSSL"

const initDevice: any = async () => {
  const config: any = await getConfig();
  const network: string = config.network;
  const autoStartNode: boolean = config.autoStartNode;
  autoStartNode == true && await startSlicer();
  connectWiFi();
  saveBlockFrostApi();
  initWebsocket();
  await checkForCert() == 0 && await buildSSLcert("spaceprinter.local", "SL", "Underground", "ThePrinterPeople");
  await checkForCert() > 0 && initWebsocketSSL();
};

const startSlicer = async(  ) => {
  console.log(`Starting gs server for slicer`);
  const cmdStartSlicer: string = "sudo systemctl start grid-apps.service";
  try{
    exec( cmdStartSlicer, { "encoding":"utf8" } );
  }catch( error ){
    console.log( error )
  };
};

const connectWiFi = async () => {
  const hlConfig:any = fs.readFileSync('/boot/firmware/hlConfig.json', 'utf8');
  console.log(JSON.parse(hlConfig));
  if(JSON.parse(hlConfig).wifiEnabled == 1){
    console.log("Connecting to WiFi: " + JSON.parse(hlConfig).ssid);
    const cmdConnWifi: string = `sudo nmcli dev wifi connect ${JSON.parse(hlConfig).ssid} password ${JSON.parse(hlConfig).ssidPass}`;
    try{
      exec( cmdConnWifi, { "encoding":"utf8" });
    }catch( error ){
      console.log( error )
    };
  };
};

const saveBlockFrostApi = async ( ) => {
  const config: any = await getConfig();
  const hlConfig:any = fs.readFileSync('/boot/firmware/hlConfig.json', 'utf8');
  console.log(JSON.parse(hlConfig));
  if( JSON.parse(hlConfig).blockfrostAPI !== "" && config.blockfrostApiKey !== "" ){
    console.log("Setting Blockfrost Api key: " +  JSON.parse(hlConfig).blockfrostAPI);
    // open the database
    const db = await open({
      filename: './db/cb.db',
      driver: sqlite3.Database
    });

    console.log("writing Config");
    const SQLSaveConfig: string = "UPDATE Config SET blockfrostApiKey=? WHERE id=1";
    try{
      const SQLSaveConfigRes: any = await db.run( SQLSaveConfig, JSON.parse(hlConfig).blockfrostAPI );
      db.close();
      console.log( SQLSaveConfigRes );
    }catch( error ){
      console.log(error);
      db.close();
    };
  };
};

const initWebsocket = async () => {
  console.log( "Starting Websocket none SSL on port: 3331 ");
  const wss = new WebSocketServer({ port: 3331 });

  let myPort = new serialport("/dev/ttyUSB0", { baudRate: 115200, autoOpen: false }); //capture serial port but don't start it.
  let Readline = serialport.parsers.Readline; // make instance of Readline parser.
  let parser = new Readline(); // make a new parser to read ASCII lines.
  myPort.pipe(parser); // pipe the serial stream to the parser.
  
  wss.on('connection',  async ( ws: any ) => {
    console.log("connected on none ssl");
    ws.send(JSON.stringify({jsonrpc: '2.0', method: 'websocket', result: ["Websocket Connected no SSL"]}))

    myPort.on('open', ( ) => {
      console.log('port open. Data rate: ' + myPort.baudRate);
      ws.send(JSON.stringify({jsonrpc: '2.0', method: 'serialPort', result: ['serial open. Data rate: ' + myPort.baudRate]}))
    });

    myPort.on('error', ( err: any ) => {
      console.log('Error: ', err.message)
      ws.send(JSON.stringify({jsonrpc: '2.0', method: 'serialPort', error: [ err.message ]}))
    });

    parser.on('data', ( data: any ) => {
      console.log(data);
      ws.send(JSON.stringify({jsonrpc: '2.0', method: 'serialPort', result: [data]}))
    });

    myPort.on('close', ( ) => {
      console.log('port closed.');
      ws.send(JSON.stringify({jsonrpc: '2.0', method: 'serialPort', result: ["Port Connection Closed"]}));
    });

    ws.on('message', ( data: any ) => {
      let message = JSON.parse(data);
      console.log(message);
      message.method == "serialPort" && message.params[0] == "open" && myPort.open();
      message.method == "serialPort" && message.params[0] == "close" && myPort.close();
    });
  });
};

const initWebsocketSSL = async () => {
  console.log( "Starting Websocket SSL on port: 3332 ");
  const server = createServer({
    key: fs.readFileSync("./cert/server.key"),
    cert: fs.readFileSync("./cert/server.cert"),
  });
  const wss = new WebSocketServer({ server });
  let myPort = new serialport("/dev/ttyUSB0", { baudRate: 115200, autoOpen: false }); //capture serial port but don't start it.
  let Readline = serialport.parsers.Readline; // make instance of Readline parser.
  let parser = new Readline(); // make a new parser to read ASCII lines.
  myPort.pipe(parser); // pipe the serial stream to the parser.
  wss.on('connection',  async ( ws: any ) => {
    console.log("connected on SSL");
    ws.send(JSON.stringify({jsonrpc: '2.0', method: 'websocket', result: ["Websocket Connected SSL"]}))

    myPort.on('open', ( ) => {
      console.log('port open. Data rate: ' + myPort.baudRate);
      ws.send(JSON.stringify({jsonrpc: '2.0', method: 'serialPort', result: ['serial open. Data rate: ' + myPort.baudRate]}))
    });
    myPort.on('error', ( err: any ) => {
      console.log('Error: ', err.message)
      ws.send(JSON.stringify({jsonrpc: '2.0', method: 'serialPort', error: [ err.message ]}))
    });

    parser.on('data', ( data: any ) => {
      console.log(data);
      ws.send(JSON.stringify({jsonrpc: '2.0', method: 'serialPort', result: [data]}))
    });
    myPort.on('close', ( ) => {
      console.log('port closed.');
      ws.send(JSON.stringify({jsonrpc: '2.0', method: 'serialPort', result: ["Port Connection Closed"]}));
    });
    ws.on('message', ( data: any ) => {
      let message = JSON.parse(data);
      console.log(message);
      message.method == "serialPort" && message.params[0] == "open" && myPort.open();
      message.method == "serialPort" && message.params[0] == "close" && myPort.close();
    });
  });
  server.listen(3332);
};

initDevice();

const checkForCert = () => {
  console.log("checking for cert Dir");
  try{
    const folderExists = fs.readdirSync("./cert/").length;
    console.log(folderExists);
    return(folderExists)
  }catch(error){
    console.log(error);
    return(error); 
  };
};

export default initDevice;
