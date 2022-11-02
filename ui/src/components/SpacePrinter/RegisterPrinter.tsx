import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { SpacePrinterAPI } from "../../api/SpacePrinterApis";
import { makeStyles, Button, DialogTitle, Dialog, DialogContent, Typography, TextField, Tooltip } from '@material-ui/core';

export const RegisterPrinter = () => {
  const [ open, setOpen ]: any = useState();
  const [ status, setStatus ]: any = useState();
  const history = useHistory();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  useEffect(
    ()=>{

  }, []);

  return (
    <>
        <Button onClick={handleOpen}>Register Printer</Button>
        <Dialog 
          onClose={handleClose} 
          aria-labelledby="simple-dialog-title" 
          open={open}
        >
        <DialogTitle id="simple-dialog-title">
          Register Printer
        </DialogTitle>
        <DialogContent>
          <div>
            Printer Operator, 
            <br /><br />
            Thank you for registering your Space Printer with the Adosia Market place.<br />
            However registrations are currently unavailable, please stay tuned for further updates.
          </div>
          <hr />
          <div>
            <Button onClick={()=>setStatus("Registration Coming Soon")} > Register</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
