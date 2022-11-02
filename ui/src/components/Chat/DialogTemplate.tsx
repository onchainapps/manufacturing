import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { SpacePrinterAPI } from "../../api/SpacePrinterApis";
import { makeStyles, Button, DialogTitle, Dialog, DialogContent, Typography, TextField, Tooltip } from '@material-ui/core';

export const DialogTemplate = () => {
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

    }
  )

  return (
    <div>
        <Button onClick={handleOpen}>Open</Button>
        <Dialog 
          onClose={handleClose} 
          aria-labelledby="simple-dialog-title" 
          open={open}
        >
        <DialogTitle id="simple-dialog-title">Change Device Name</DialogTitle>
        <DialogContent>

        </DialogContent>
      </Dialog>
    </div>
  );
}
