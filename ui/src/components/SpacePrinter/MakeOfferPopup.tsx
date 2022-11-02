import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { SpacePrinterAPI } from "../../api/SpacePrinterApis";
import { makeStyles, Button, DialogTitle, Dialog, DialogContent, Typography, TextField, Tooltip } from '@material-ui/core';

export const MakeOfferPopup = () => {
  const [ open, setOpen ]: any = useState();
  const [ offerAda, setOfferAda ] = useState();
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
      
  }, [])

  return (
    <div>
        <Button onClick={handleOpen}>Make Offer</Button>
        <Dialog 
          onClose={handleClose} 
          aria-labelledby="simple-dialog-title" 
          open={open}
        >
        <DialogTitle id="simple-dialog-title">Make Offer For Printing</DialogTitle>
        <DialogContent>
        <div>
        <TextField
          variant="outlined"
          margin="dense"
          required
          id="offerAda"
          name="offerAda"
          label="Offer ADA"
          value={offerAda}
          style={{width: 400}}
          onChange={(event:any) => { setOfferAda(event.target.value) }}
        />
        </div>
        <div>
          <Button onClick={()=>setStatus("Coming Soon, Thanks for being here.")}>Make Offer</Button>
        </div>
        {status && <div>{status}</div>}
        </DialogContent>
      </Dialog>
    </div>
  );
}
