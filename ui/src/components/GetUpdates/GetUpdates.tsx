import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, ButtonBase, Dialog, DialogActions, DialogContent, DialogTitle, Checkbox, makeStyles } from "@material-ui/core"; //tslint:disable-line
import { SpacePrinterAPI } from "../../api/SpacePrinterApis";
import useDarkMode from "use-dark-mode";

export const GetUpdates: React.FC = () => {
  const darkMode = useDarkMode();
  const useStyles = makeStyles({
    UpdateWindow: {
      width: 500,
      minHeight: 200,
      padding: 10,
      color: `${darkMode.value ? "#000" : "#0f0" }`,
      borderRadius: 10,
      border: `1px dashed ${darkMode.value ? "#fff" : "#000"}`,
      fontFamily: "monospace",
      textAlign: "left",
      overflow: "auto",
      marginRight: "5",
      cursor: "text"
    } 
  });

  const classes = useStyles();
  const [ updateButtonText, setUpdateButtonTxt ] = useState("Update");
  const [ installButtonTxt, setInstallButtonTxt ] = useState("Restore");
  const [ updateAPIState, setUpdateAPIState ]  = useState("");
  const [ updateUIstate, setUpdateUIstate ] = useState("");
  const [ updateStatus, setUpdateStatus ] = useState("");
  const [ checked, setChecked ] = useState(false);
  const [ open, setOpen ] = useState(false)
  const jwToken: any = sessionStorage.getItem("jwtoken");
  const history = useHistory();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const updateApi = async () => {
    setUpdateButtonTxt("Updating");
    setUpdateUIstate("Updating UI");
    const deviceName: string = window.location.hostname;
    const userName: any = sessionStorage.getItem("userName");
    const getUpdUIResult: any = await SpacePrinterAPI.update( jwToken, userName, "ui");
    console.log(getUpdUIResult);
    setUpdateUIstate(`UI Update: ${getUpdUIResult}`);

    setUpdateAPIState("Updating Api");
    const getUpdApiResult: any = await SpacePrinterAPI.update( jwToken, userName, "update");
    console.log(getUpdApiResult);
    setUpdateAPIState( `Api Update: ${getUpdApiResult}` );
    
    getUpdApiResult === "ok" && getUpdUIResult === "ok" ? setUpdateButtonTxt("Update") : setUpdateButtonTxt("Error: Try Again");
    getUpdApiResult === "ok" && getUpdUIResult === "ok" &&sessionStorage.clear();
    getUpdApiResult === "ok" && getUpdUIResult === "ok" && window.location.assign("http://"+deviceName);
  };

  const resetDefault = async () => {
    setInstallButtonTxt("Running Full Reset");
    setUpdateUIstate("Restoring UI files");
    const deviceName: string = window.location.hostname;
    const userName: any = sessionStorage.getItem("userName");
    const getUpdUIResult: any = await SpacePrinterAPI.update( jwToken, userName, "ui");
    console.log(getUpdUIResult);
    setUpdateUIstate(`UI Update: ${getUpdUIResult}`);

    setUpdateAPIState("Wiping and installing");
    const getUpdApiResult: any = await SpacePrinterAPI.update( jwToken, userName, "full");
    console.log(getUpdApiResult);
    setUpdateAPIState( `Api Update: ${getUpdApiResult}` );
    
    getUpdApiResult === "ok" && getUpdUIResult === "ok" ? setInstallButtonTxt("Reset Full") : setInstallButtonTxt("Error: Try Again");
    getUpdApiResult === "ok" && getUpdUIResult === "ok" && sessionStorage.clear();
    getUpdApiResult === "ok" && getUpdUIResult === "ok" && window.location.assign("http://"+deviceName);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(checked)
    setChecked(event.target.checked);
  };

  return (
    <>      
      <ButtonBase onClick={handleClickOpen}>
        Update
      </ButtonBase>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >   
      <DialogTitle id="alert-dialog-title">
        Software Updates
      </DialogTitle>
      <DialogContent>
        <div>
          <div className={classes.UpdateWindow}>
            This update will updated your space printer software backend and user interface to the latest version without touching any data.
            <br />
            Press refresh on your broswer after the update in the login screen to make sure all UI changes took.
            <br />
            <Button variant="outlined" onClick={()=>updateApi()}>{ updateButtonText && updateButtonText }</Button>
          </div>
          <hr/>
          <div className={classes.UpdateWindow}>
            Pressing this button will reset your Space Printer software state to default settings, meaning it will delete all wallets and user names in the DB and you'll pretty much have a clean slate.<br /><br />
            During this testing phase, this will be used to update any new changes to the Space Printer DB and other more important components without having to download and burn the image each time.(Migration tool coming soon)/<br/><br/>
            After the wipe is done, you will be directed to the user creation page.
            <br />
            Press refresh on your broswer after the update in the login screen to make sure all UI changes took.
            <br />
            {
              <Button 
                variant="outlined" 
                onClick={()=>resetDefault()}
                disabled={ checked == true ? false : true  }
              >
                  { installButtonTxt && installButtonTxt }
              </Button>
          }
            <Checkbox
            checked={checked}
            onChange={handleChange}
            inputProps={{ 'aria-label': 'primary checkbox' }}
            />
          </div>
          <div>
            { updateUIstate && updateUIstate }
            <br />
            { updateAPIState && updateAPIState }
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
