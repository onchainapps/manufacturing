import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { SpacePrinterAPI } from "../../api/SpacePrinterApis";
import { makeStyles, Button, DialogTitle, Dialog, DialogContent, Typography, TextField, Tooltip } from '@material-ui/core';

export const ViewOrderStatus = () => {
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
    <>
        <Button onClick={handleOpen}>View Order Status</Button>
        <Dialog 
          onClose={handleClose} 
          aria-labelledby="simple-dialog-title" 
          open={open}
        >
        <DialogTitle id="simple-dialog-title">Print Order Status</DialogTitle>
        <DialogContent>
          <div>
            You can view 
          </div>
          <hr />
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
            <Button onClick={()=>setStatus("Coming Soon, Thanks for being here.")}>All stages of orders and interactions with order will be displayed here.</Button>
          </div>
          {status && <div>{status}</div>}
        </DialogContent>
      </Dialog>
    </>
  );
}
