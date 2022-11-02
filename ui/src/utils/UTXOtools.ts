import { SpacePrinterAPI, SpacePrinterWSS, blockfrostApi } from "../api/SpacePrinterApis";
import { OgmiosWS, wsp } from "../api/OgmiosApi";
import { KupoAPI } from "../api/KupoApi";

export const parseOgmiosUtxos = async ( address: string ) => {
  let lovelaceTotal = 0;
  let utxos: any = [];
  // old SC address use for now addr_test1wrxf5ul7h3sf095u8a6fsh2y9sm8lfjj26s4x9gk4mm0wvqkxf5hp
  // address = "addr_test1qzsuzrz8v7nrleyc8uvg946dzyr99608xdw5nk64l98fss06qc7n0m9a2l0rxvmgeunvkqm2zzqq8zl3yn5jwqm3t44qqudqtt"

  console.log("websocket state", OgmiosWS.readyState);

  try{
    console.log("Ogmios connection open");
    sessionStorage.setItem("ogmiosHealth", "connected")

    wsp("Query", { "query": { "utxo": [ address ] }});

    OgmiosWS.onmessage = ( e: any ) => {
      const results: any = JSON.parse(e.data)
      console.log("ogmiso raw result", results)
      results.result.map(( utxo: any) => {
          // console.log(utxo)
          lovelaceTotal = lovelaceTotal + utxo[1].value.coins;
          Object.entries(utxo[1].value.assets).map( async ( asset: any ) => {
          // console.log(asset[0]);
          const policyID: string = asset[0].split(".")[0];
          const assetName: string = asset[0].split(".")[1];
          const metadata: any = await blockfrostApi(`https://cardano-testnet.blockfrost.io/api/v0/assets/${policyID+assetName}`, "GET", "");
          utxos.push({ "meta": metadata,"asset": asset[0]+"."+utxo[0].txId+utxo[0].index, "assetAmount": asset[1], "TxId": utxo[0].txId, "txIndex":  utxo[0].index, "utxo": utxo });
        })
        // console.log(utxo[1].value.coins)
        utxos.push({ "TxId": utxo[0].txId, "txIndex":  utxo[0].index, "datum":  utxo[1].datum, "assets":utxo[1].value.assets, "loveLace": utxo[1].value.coins  });
      });
      utxos.push( lovelaceTotal );
    };
    console.log(utxos);
    return(utxos);
   
  }catch( error ){
    console.log(error);
    return("error")
  };
};