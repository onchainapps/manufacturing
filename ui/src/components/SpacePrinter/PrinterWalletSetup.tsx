import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Grid } from "@material-ui/core";
import { PrinterTerminal } from "./PrinterTerminal";
import { GenPrinterWallet } from "./GenPrinterWallet";

export const PrinterWalletSetup: React.FC = () => {
  const history = useHistory();
  const [ printerUUID, setPrinterUUID ] = useState();
  const [ open, setOpen ] = useState(false);
  return (
    <>
      <div style={{ textAlign: "left", marginBottom: 20 }}>
        <strong>YOU MADE IT:</strong><br/>
        The "Printer Terminal" you see here will help you create a wallet for your 3D printer.<br/>
        Having a wallet for your 3D printer, will allow you to register your 3D printer with the Adosia Market place.<br/>
        From where you can select and full fill print jobs.
        <br/><br/>
        Please refer to the step by step instructions to help you along.
      </div>
      <hr />
      {
        !printerUUID ? 
          <div style={{ margin: "0 5px 0 0" }}>
            <div style={{float: "left", marginRight: 10}}>
              <PrinterTerminal setPrinterUUID={ setPrinterUUID } />
            </div>
            <div style={{textAlign: "left", width: "95%", marginLeft: 5, padding: "20px"}} >
              <b>STEP 1:</b> <br/>
              Make sure your Pi is connected to your printer with the proper USB cable, not all USB cables are the same.
              <br />
              If your 3D printer manufacturer didn’t provide a USB cable, you will have to purchase one or more than likely have a compatible cable laying around at home.
              Please refer to your printers manual for proper USB cable refrence.
              <hr/>
              <b>STEP 2:</b> <br/>
              Once you've connected your 3D printer to the Raspberry Pi, press the connect button under the terminal window and wait for the following message:
              <br/>
              “serial open. Data rate: 115200”
              <br/>
              Once you see this messsage - enter "M115" in the "Printer Command" input box or use the "Commands" drop down to select it and press "SEND".<br />
              NOTE: On some ocasions you might get "port already open" message, that is fine as well.
              <br/>

            </div>
          </div>
          :
          <div style={{ margin: "0 5px 0 0" }}>
            <div style={{float: "left", marginRight: 10, minHeight:500}}>
              <GenPrinterWallet printerUUID={printerUUID} />
            </div>
            <div style={{textAlign: "left", width: "95%", marginLeft: 5, padding: "20px"}}>
              <b>STEP 3:</b> <br/> 
              If everything went well you should be looking at two text boxes, one will have your printer UUID in it and the other one will ask for a password.<br/>
              10 Character password is required and submit.<br /><br />
              At this point you have created a wallet for your printer. Please stand by for instructions on how to register your Wallet with the Adosia Market place.
              <br/><br />
              Also don't forget you will need a few test ADA in your wallet to complete the Printer Registration transaction and to be able to interact with the Adosia Market Place.
              <br /><br />
              Mean while you can operate your wallet like you would any other wallet through the Wallet link in the menu on the left OR click <Button onClick={()=>{history.push("/CBWalletPage")}}>HERE</Button>.
              <hr/>
              Happy Printing.
            </div>
          </div>
        }
    </>
  );
};
