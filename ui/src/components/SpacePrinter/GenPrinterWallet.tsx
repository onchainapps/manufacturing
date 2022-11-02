import React, { useState } from "react";
import { Button, Grid, TextField } from "@material-ui/core"; //tslint:disable-line
import { SpacePrinterAPI } from "../../api/SpacePrinterApis";
import { useHistory } from "react-router-dom";

interface WalletProps {
  printerUUID: any,
}

export const GenPrinterWallet:React.FC<WalletProps> = ( { printerUUID } ) => {
  const history = useHistory();
  const [ passPhrase, setPassPhrase ] = useState<string>("");
  const [ walletType, setWalletType ] = useState<any>("printer")
  const [ status, setStatus ] = useState<any>();
  const [ seedPhrase, setSeedPhrase ] = useState("");
  const [ viewSeedPhrase, setViewSeedPhrase ] = useState("password")

  const createWallet = async () => {
    if(passPhrase === "" ) { return setStatus("Please enter password."); };
    if(passPhrase.length < 10){return setStatus("Password needs to be 10 character or longer."); };
    const jwtoken: any = sessionStorage.getItem("jwtoken");
    const userName: any = sessionStorage.getItem("userName");
    try{
      const result: any = await SpacePrinterAPI.genCBWallet( jwtoken, userName, printerUUID, "", passPhrase, walletType );
      result && result.walletID && await SpacePrinterAPI.genCBWalletAccount( jwtoken, userName, result.walletID, printerUUID, passPhrase );
      console.log(result);
      result && result.seed ? setSeedPhrase( result.seed ) : setStatus( result.error );
    }catch (error){
      console.log(error)
    };
  };

  return (
    <>
      <Grid container>
      <div style={{ margin: "0 5px 0 0" }}>
      {
      !seedPhrase ?
        <div>
          <TextField
            variant="outlined"
            margin="dense"
            required
            id="walletName"
            name="walletName"
            label="Wallet Name"
            value={printerUUID}
            fullWidth
            disabled
          />
          <TextField
            type="password"
            variant="outlined"
            margin="dense"
            required
            id="passPhrase"
            name="passPhrase"
            label="Password"
            value={passPhrase}
            fullWidth
            onChange={(event:any) => {setPassPhrase(event.target.value)}}
          />
          <br />
          <div>
            <Button variant="outlined" onClick={()=>createWallet()}>Submit</Button> 
          </div>
          {status && <div>{status}</div>}
        </div>
        :
        <div>
          <span style={{color: "red", fontWeight: "bold"}}>Makes sure you record this seed Phrase, once this window disapears it will be none recoverable you HAVE BEEN WARNED.</span><br/><br/> 
          <div>
            Phrase:<br />
            <TextField
            type={viewSeedPhrase}
            variant="outlined"
            margin="dense"
            id="seedPhrase"
            name="seedPhrase"
            label="seedPhrase"
            value={seedPhrase}
            fullWidth
            />
          </div>
          <div>
            <Button onClick={()=>setViewSeedPhrase("text")}>View Phrase</Button>
          </div>
          <div>
          <Button onClick={()=>{history.push("/CBWalletPage")}}>View Wallets</Button>
          </div>
        </div>       
      }
      </div>
      </Grid>    
    </>
  );
};