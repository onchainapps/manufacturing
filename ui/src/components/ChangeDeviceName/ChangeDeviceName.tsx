import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { SpacePrinterAPI } from "../../api/SpacePrinterApis";
import { makeStyles, Button, ButtonBase, DialogTitle, Dialog, DialogContent, Typography, TextField, Tooltip } from '@material-ui/core';

export const ChangeDeviceName = () => {
  const [ newDeviceName, setNewDeviceName ] = useState("");
  const [ deviceName, setDeviceName ] = useState("");
  const [ open, setOpen ]: any = useState();
  const [ nameChanged, setNameChanged ]: any = useState();
  const [ status, setStatus ]: any = useState();
  const history = useHistory();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const checkDeviceName = () => {
    const deviceName: string = window.location.hostname;
    deviceName == "spaceprinter.local" ? setNameChanged("notChanged") : setNameChanged("changed");

  };

  const changeName = async () => {
    const jwtoken: any = sessionStorage.getItem("jwtoken");
    const userName: any = sessionStorage.getItem("userName");

    const changeNameRes: any = await SpacePrinterAPI.changeDeviceName( jwtoken, userName, newDeviceName );
    console.log(changeNameRes);

    changeNameRes == "ok" ? setStatus("Name changed to: " + newDeviceName + ". Device will reboot within 5 seconds") : setStatus("error");
    
    setTimeout(
      ()=>{
        window.location.assign(`https://${newDeviceName}.local`);
      }, 7000 );
  };

  useEffect(
    ()=>{
      console.log(window.location.hostname);
      checkDeviceName();
    }, [])

  return (
    <>
      {
        nameChanged && nameChanged === "notChanged"  ? 
        <Tooltip title="Please consider changing your device name">
          <ButtonBase onClick={handleOpen}>
            Change Name
          </ButtonBase> 
        </Tooltip>
        :  
        <Tooltip title="Please consider changing your device name">
          <ButtonBase onClick={handleOpen}>
            Change Name
          </ButtonBase>
        </Tooltip>
      }
      
      <Dialog 
        onClose={handleClose} 
        aria-labelledby="simple-dialog-title" 
        open={open}
      >
      <DialogTitle id="simple-dialog-title">Change Device Name</DialogTitle>
        <DialogContent>
          <div>
            If you are running more than one Space Printer device on your network each one will need to have a unique name to access it reliably.
          </div>
          <div>
            <TextField
              variant="outlined"
              margin="dense"
              required
              id="deviceName"
              name="deviceName"
              label="Device Name"
              value={newDeviceName}
              onChange={(event:any) => {setNewDeviceName(event.target.value)}}
            />
          </div>
          <div>
            <Button onClick={ ()=>changeName() }>Change</Button>
          </div>
          { status && status }
        </DialogContent>
      </Dialog>
    </>
  );
}
