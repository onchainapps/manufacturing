import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { SpacePrinterAPI } from "../../api/SpacePrinterApis";
import { makeStyles, Button, DialogTitle, Dialog, DialogContent, Typography, TextField, Tooltip, ButtonBase } from '@material-ui/core';

export const GenSSL = () => {
  const [ open, setOpen ]: any = useState();
  const [ status, setStatus ]: any = useState();
  const history = useHistory();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const genCert = async () => {
    const jwtoken: any = sessionStorage.getItem("jwtoken");
    const userName: any = sessionStorage.getItem("userName");
    setStatus("Generating SSL");
    const genCertRes = await SpacePrinterAPI.genSSL(jwtoken, userName, window.location.hostname, "SL", "Underground", "ThePrinterPeople");
    setStatus("New SSL Certificate created. Please Restart your Space Printer device for all changes to take effect. You will also have to accept the new certificate after restart.")
  };

  useEffect(
    ()=>{

    }
  )

  return (
    <div>
        <ButtonBase onClick={handleOpen}>Gen New SSL</ButtonBase>
        <Dialog 
          onClose={handleClose} 
          aria-labelledby="simple-dialog-title" 
          open={open}
        >
        <DialogTitle id="simple-dialog-title">Generate SSL</DialogTitle>
        <DialogContent>
        <div>
          A new SSL certificate will be create for: {window.location.hostname}
        </div>
        <div>
          <Button onClick={()=>genCert()}>
            Create SSL
          </Button>
        </div>
        {status && <div>{status}</div>}
        </DialogContent>
      </Dialog>
    </div>
  );
}
