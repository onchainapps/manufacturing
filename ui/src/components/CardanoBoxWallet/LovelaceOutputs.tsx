import React, { useState, useEffect } from "react";
import { SpacePrinterAPI } from "../../api/SpacePrinterApis";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, makeStyles, Theme, TextField  } from "@material-ui/core"; //tslint:disable-line
import { hex2a } from "../../utils/hextools";

type LovelaceOutputsProps = {
  outputs: any
  setOutputs: any,
  outputAddress: any,
  setOutputAddress: any,
  outputLovelace: any,
  setOutputlovelace: any,
  walletPassword: any,
  setWalletPassword: any
}

export const LovelaceOutputs: React.FC<LovelaceOutputsProps> = ({ outputs, setOutputs, outputAddress, setOutputAddress, outputLovelace, setOutputlovelace, walletPassword, setWalletPassword }) => {
  const useStyles = makeStyles(( theme: Theme ) => ({
    root: {
      flexGrow: 1,
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
  }));

  const classes = useStyles();

  
  const updateLovelaceOutput = async () => {
    let exists = 0;
    const datums: any = [
                          /*
                          {
                            "datumFieldsOuter":[
                              { "constructor": "0" },
                              // { "datumType": "int",  "datumValue": "7000000", "byteType": "" },
                              // { "datumType": "byte", "datumValue": "a1c10c4767a63fe4983f1882d74d110652e9e7335d49db55f94e9841", "byteType": "hex" },
                              // { "datumType": "byte", "datumValue": "", "byteType": "hex" },
                              // { "datumType": "int",  "datumValue": "0", "byteType": "" },
                              // { "datumType": "int",  "datumValue": "0", "byteType": "" }, 
                            ]
                          },
                          {
                            "datumFieldsInner":[
                                { "constructor": "0" },
                                { "datumType": "int",  "datumValue": "7000000", "byteType": "" },
                                { "datumType": "byte", "datumValue": "a1c10c4767a63fe4983f1882d74d110652e9e7335d49db55f94e9841", "byteType": "hex" },
                                { "datumType": "byte", "datumValue": "", "byteType": "hex" },
                                { "datumType": "int",  "datumValue": "0", "byteType": "" },
                                { "datumType": "int",  "datumValue": "0", "byteType": "" }, 
                            ]
                          },
                          */
                        ]
    const redeemers: any =  [
                              /*
                              { "constructorOuter": "1" },
                              { "constructorInner": "0" },
                              { "redeemerType": "byte", "redeemerValue": "a1c10c4767a63fe4983f1882d74d110652e9e7335d49db55f94e9841", "byteType": "hex" },
                              { "redeemerType": "int",  "redeemerValue": "12000000", "byteType": "" },
                              */
                            ]
    const plutus: any =   [    
                          //  {
                          //    "script": "591e18591e1501000033233223322332233223232333222323332223233333333222222223233322232333322223232332232333222323332223232332233223232333332222233223322332233223322332222323232323223232232325335303833300d3333573466e1cd55cea805a400046666644"
                          //  }
                          ]
    await outputs.map(( output: any, key: any )=> {
      console.log(output)
      if (output.id == "lovelace"){
      outputs[key].outputValue = outputLovelace
      outputs[key].outputAddress = outputAddress
      exists = 1
    }});
    exists == 0 && 
    setOutputs( [ ...outputs,
      {
        id: "lovelace",
        outputAddress: outputAddress,
        outputValue: outputLovelace,
        datums,
        redeemers,
        plutus
      }
    ])
  };

  return (
    <>
      <div>
        <TextField
          autoFocus
          variant="outlined"
          type="text"
          margin="dense"
          required
          id="outputAddress"
          name="outputAddress"
          label="Send to Address"
          value={outputAddress}
          onChange={(event:any) => {setOutputAddress( event.target.value )}}
          style={{ height: "50px", width: "75%" }}
          onBlur={ () => { outputLovelace !== "" && updateLovelaceOutput() }}
        />
        <TextField
          variant="outlined"
          type="number"
          margin="dense"
          required
          id="outputLoveace"
          name="outputLovelace"
          label="Amount Lovelace to send"
          value={outputLovelace}
          onChange={( event:any ) => { setOutputlovelace( event.target.value ); }}
          style={{ height: "50px", width: "75%" }}
          disabled={outputAddress.length < 108  && true} // 103 mainnet
          onBlur={ () => { outputLovelace !== "" && updateLovelaceOutput() }}
          onClick={ () => { outputLovelace === 0 && setOutputlovelace("") }}
        />
        <TextField
          variant="outlined"
          type="password"
          margin="dense"
          required
          id="walletPassword"
          name="walletPassword"
          label="Wallet Password"
          value={walletPassword}
          onChange={(event:any) => {setWalletPassword( event.target.value )}}
          style={{ height: "50px", width: "75%" }}
          disabled={outputLovelace < 1000000 && true}
        />
      </div>
    </>
  );
}
