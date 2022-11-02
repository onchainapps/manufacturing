const W3CWebSocket = require('websocket').w3cwebsocket;

// Create websocket for Ogmios on Cardano Box

export const OgmiosWS = new W3CWebSocket(
  sessionStorage.getItem("ogmiosURI") == null ?
    window.location.protocol == "http:" ? 
    `ws://ogmiostest.bakon.dev`
    :
    `wss://ogmiostest.bakon.dev`
    :
    window.location.protocol == "http:" ? 
    `ws://${sessionStorage.getItem("ogmiosURI")}:${sessionStorage.getItem("ogmiosPort")}`
    :
    `wss://${sessionStorage.getItem("ogmiosURI")}:${sessionStorage.getItem("ogmiosPort")}`
);

OgmiosWS.onopen = () => {
  console.log("Ogmios connection open");
  sessionStorage.setItem("ogmiosHealth", "connected")
};

OgmiosWS.onerror = () => {
  console.log('Ogmios Connection Error');
  sessionStorage.setItem("ogmiosHealth", "ERROR!!!")
};

export const wsp = (methodname: any, args: any) => {
  OgmiosWS.send(JSON.stringify({
    type: "jsonwsp/request",
    version: "1.0",
    servicename: "ogmios",
    methodname,
    args
  }));
}