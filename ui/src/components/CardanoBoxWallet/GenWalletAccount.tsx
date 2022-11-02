import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@material-ui/core"; //tslint:disable-line
import { SpacePrinterAPI, SpacePrinterWSS } from "../../api/SpacePrinterApis";

type walletProps = {
  jwToken: string,
  walletID: string,
  getWalletAccounts: any,
}

const GenWalletAccount:React.FC<walletProps> = ( { jwToken, walletID, getWalletAccounts } ) => {
  const [ accountName, setAccountName ] = useState<string>("");
  const [ passPhrase, setPassPhrase ] = useState<string>("");
  const [ status, setStatus ] = useState<any>();
  const [ open, setOpen ] = useState<boolean>(false)

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setAccountName("");
    setPassPhrase("");
    setOpen(false);
  };

  const genAccount = async () => {
    
    if(accountName === "" ) { return setStatus("Please enter account name."); };
    if(passPhrase === "" ) { return setStatus("Please enter password."); };

    const jwtoken: any = sessionStorage.getItem("jwtoken");
    const userName: any = sessionStorage.getItem("userName");
    try{
      const result: any = await SpacePrinterAPI.genCBWalletAccount( jwtoken, userName, walletID, accountName, passPhrase );
      console.log( result );
      result.code ? setStatus("Error") : setStatus( result )
      getWalletAccounts( walletID )
    }catch( error ){
      console.log(error);
      setStatus("error");
    } 
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
         +Account
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >   
      <DialogTitle id="alert-dialog-title">
        New Account
      </DialogTitle>
      <DialogContent>
      <div style={{border:"1px dashed #fff", padding: 5}}>
        <div>
          <TextField
            variant="outlined"
            margin="dense"
            required
            id="accountName"
            name="accountName"
            label="accountName"
            value={accountName}
            fullWidth
            onChange={(event:any) => {setAccountName(event.target.value)}}
          />
          <TextField
            type="password"
            variant="outlined"
            margin="dense"
            required
            id="passPhrase"
            name="passPhrase"
            label="Wallet Password"
            value={passPhrase}
            fullWidth
            onChange={(event:any) => {setPassPhrase(event.target.value)}}
          />
        </div>
        { status && <div>{status}</div> }
        <br />
        <div>
          <Button variant="outlined" onClick={()=>genAccount()}>Submit</Button> 
        </div>
      </div>
      </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GenWalletAccount;
