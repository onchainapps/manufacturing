import React, { useState, useEffect } from 'react';
import { makeStyles, Paper, TableContainer, FormControlLabel, Button } from '@material-ui/core/'; //tslint:disable-line
import { DataGrid, GridRowModel } from '@mui/x-data-grid';
import { SpacePrinterAPI } from "../../api/SpacePrinterApis";
import { a2hex, hex2a } from "../../utils/hextools";
import { STLDialog } from "./STLDialog";
import { SendTXOgmios } from "./SendTXOgmios";
import { SendTXBlockFrost } from "./SendTXBlockFrost";

type TxPreviewProps = {
  jwToken: any,
  accountName: string, 
  walletID: string,
  address: string,
  utxos: any,
  setUtxos: any,
  utxoCheck: any, 
  setUtxocheck: any,
  assetCheck: any,
  setAssetcheck: any,
  outputs: any, 
  setOutputs: any,
  walletPassword: string,
  outputAddress: string,
  outputLovelace: string,
  getAddressInfo: any,
}

export interface IInputWrapperProps {
  children?: React.ReactNode;
}

export const TxPreview: React.FC<TxPreviewProps> = ({ jwToken, walletID, accountName, address, utxos, setUtxos, utxoCheck, setUtxocheck, assetCheck, setAssetcheck, outputs, setOutputs, walletPassword, outputAddress, outputLovelace, getAddressInfo }) => {
  const useStyles = makeStyles({
    root: {
      width: '50%',
      float: "left",
      height: 550
    }
  });

  const classes = useStyles();
  const [ openSendTx, setOpenSendTx ]: any = useState(false);
  const [ txResult, setTxResult ]: any = useState();
  const [ status, setStatus ]: any = useState();

  const genTx = async () => {    

    if(utxos.length === 0)return(setStatus("Not Utxos"));
    if(outputs.length === 0)return(setStatus("Not Outputs"));
    if(walletPassword === "" )return(setStatus("Password not Provided"))

    const metadata =  [
                        {
                          "label": "420",  // label
                          "metadata":{
                            "sendfrom": "Space Printer",
                            "uuid": accountName
                          }  // metadata stringified object
                        }
                      ]

    // assets deprecated
    const assets: any = [];
    const jwToken: any = sessionStorage.getItem("jwtoken");
    const userName: any = sessionStorage.getItem("userName");
 
    try{
      const genTxResult: any = await SpacePrinterAPI.genGruntTX(
        jwToken,
        userName,
        walletID,
        walletPassword,
        accountName,
        JSON.stringify(utxos), // [{ txix: string, txIndex: number, inputValue: string }]
        JSON.stringify(assets), // deprecated
        JSON.stringify(metadata), // [{ label: string, metadata: stringified object }]
        JSON.stringify(outputs), // [{ outputAddress: string, outputValue: string, datums: [{ "datumType": "byte"|"int", datumValue: string, "byteType": "hex"|"utf8" }] }]
        address, // where unused assets or lovelace from UTXO should go to
        91694786
      );
      console.log(genTxResult);
      setTxResult(genTxResult);
      // setOpenSendTx(true);
    }catch(error){
      console.log(error);
    };
  };

  useEffect(() => {
    genTx();
  }, [])

  return (
    <>
    <Paper className={classes.root}>
    <>
          {console.log(utxos)}
          UTXOs included in TX:<br />
          {
            utxos && utxos.length > 0 ? 
            <DataGrid
              columns={[
                { field: "txix", headerName: "TX ID", minWidth: 530 },
                { field: 'txIndex', headerName: "TX Index", width: 60 },
                { field: 'inputValue', headerName: "Lovelaces", width: 100 }
              ]}
              rows={ utxos }
            />
            :
            <DataGrid
              columns={[]}
              rows={ [] }
            />
          }
    </>
    </Paper>
    <Paper className={classes.root}>
    <>
          {console.log(outputs)}
          Sending: <br />
          {
            outputs && outputs.length > 0 ?
            <DataGrid
              columns={[
                { field: "outputAddress", headerName: "Sending To", minWidth: 530 },
                { field: "assetName", headerName: "Asset", minWidth: 200 },
                { field: "outputValue", headerName: "Lovelaces", minWidth: 200 },
              ]}
              rows={ outputs }
            /> :
            <DataGrid
              columns={[]}
              rows={ [] }
            />
          }
    </>
    </Paper>
    {
      txResult && txResult.cborHex ? 
        <div style={{padding: 10, margin: 10, height: 30}}>
          
          {
            
            sessionStorage.getItem("sessionType") == "blockfrost" ?
              <><SendTXBlockFrost jwToken={jwToken} txResult={txResult} getAddressInfo={getAddressInfo} /><br /></>
              :
              <><SendTXOgmios txResult={txResult} getAddressInfo={getAddressInfo} /><br /></>
            
          }
          Tx Fee: { txResult.fee } lovelace<br />
        </div>
      :
        <div>
          { txResult ? txResult : status }
        </div>
    }
    </>
  );
}
