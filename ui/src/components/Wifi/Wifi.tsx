import React, { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { SpacePrinterAPI } from "../../api/SpacePrinterApis";
import { makeStyles, Radio, useTheme, Theme, createStyles, ButtonBase, Button, DialogTitle, Dialog, DialogContent, Typography, TextField, Tooltip } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    ssid: {
      width: "%",
      border: "1px solid #000",
      margin: 5,
      padding:5
    },
  }),
);

export const Wifi = () => {
  const classes = useStyles();
  const [ open, setOpen ]: any = useState();
  const [ ssids, setSSIDs ]: any = useState();
  const [ status, setStatus ]: any = useState();
  const [ connStatus, setConnStatus ]: any = useState();
  const [ selectedWifi, setSelectedWifi ] = useState("");
  const [ wifiPassword, setWifiPassword ]:any = useState({});
  let refreshTimer:any = useRef();
  const history = useHistory();

  const handleOpen = () => {
    startWifiPoll();
    setOpen(true);
  };

  const handleClose = () => {
    stopWifiPoll();
    setOpen(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedWifi(event.target.value);
  };

  const handleWifiPassword = (event: React.ChangeEvent<HTMLInputElement>,) => {
   // console.log(event.target.name);
    // console.log(event.target.value);
    setWifiPassword({ ...wifiPassword, [event.target.name]: event.target.value })
  };

  const wifiStatus = async () => {
    console.log("Checking Wifi Status");
    const jwtoken: any = sessionStorage.getItem("jwtoken");
    const userName: any = sessionStorage.getItem("userName");
    try{
      const wifiResult: any = await SpacePrinterAPI.manageWifi( jwtoken, userName, "status", "", "" );
      console.log(JSON.parse(wifiResult));
      JSON.parse(wifiResult).length > 0 && setSSIDs(JSON.parse(wifiResult));
      JSON.parse(wifiResult).length == 0 && wifiScan();
    }catch(error){
      console.log(error)
    };
  };

  const wifiScan = async () => {
    console.log("Getting Wifi Networks");
    const jwtoken: any = sessionStorage.getItem("jwtoken");
    const userName: any = sessionStorage.getItem("userName");
    try{
      const wifiResult: any = await SpacePrinterAPI.manageWifi( jwtoken, userName, "scan", "", "" );
      // console.log(JSON.parse(wifiResult));
      setSSIDs(JSON.parse(wifiResult));
    }catch(error){
      console.log(error)
    }
  };

  const wifiConnect = async ( ssid: string ) => {
    console.log("Connecting to Wifi: " + ssid);
    setConnStatus("Connecting")
    const jwtoken: any = sessionStorage.getItem("jwtoken");
    const userName: any = sessionStorage.getItem("userName");
    try{
      const wifiConnectRes: any = await SpacePrinterAPI.manageWifi( jwtoken, userName, "connect", ssid, wifiPassword[ssid] )
      console.log(wifiConnectRes)
    }catch( error ){
      console.log (error )
    };
  };

  const wifiDisconnect = async ( ssid: string ) => {
    console.log("Disconnectin Wifi : " + ssid );
    const jwtoken: any = sessionStorage.getItem("jwtoken");
    const userName: any = sessionStorage.getItem("userName");
    try{
      const wifiConnectRes: any = await SpacePrinterAPI.manageWifi( jwtoken, userName, "disconnect", ssid, "" )
    }catch( error ){
      console.log (error )
    };
  };

  const startWifiPoll: any = async () => {
    wifiStatus();
    const refreshWalletTimer: any = setInterval(() => {
      wifiStatus();
    }, 10000);
    refreshTimer.current = refreshWalletTimer;
  };

  const stopWifiPoll: any  = async () => {
    clearInterval(refreshTimer.current);
  };

  return (
    <>
      <ButtonBase onClick={handleOpen}>
        WiFi
      </ButtonBase>
      <Dialog 
        onClose={handleClose} 
        aria-labelledby="simple-dialog-title" 
        open={open}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle id="simple-dialog-title">
          Wifi Networks { selectedWifi && selectedWifi }
        </DialogTitle>
        <DialogContent>
        {
          ssids && ssids.length > 0 ?
          ssids.map(( ssid: any ) =>
            <div className={classes.ssid}>
              <div style={{marginLeft: 50}}>
                { ssid.bssid && <span>bssid: { ssid.bssid } <br /> </span> }
                { ssid.ssid &&  <span>ssid: { ssid.ssid } <br /> </span> }
                <span>freq:     { ssid.freq }mhz </span> <br />
                <span>Strength: { ssid.signal_dbm <= 0 && ssid.signal_dbm >= -30 && "SUPER GOUDA" } 
                                { ssid.signal_dbm <= -31 && ssid.signal_dbm >= -50 && "OK GOUDA" } 
                                { ssid.signal_dbm <= -51 && ssid.signal_dbm >= -70 && "GOUDA" } 
                                { ssid.signal_dbm <= -71 && "NOT SO GOUDA" }
                </span><br />                
                { !ssid.tx_bitrate && <span><Button onClick={ ()=>wifiConnect(  ssid.ssid  ) }>Connect</Button><br /> </span> }
                { !ssid.tx_bitrate && <span>
                  <TextField
                    variant="outlined"
                    margin="dense"
                    required
                    id="wifiPassword"
                    name={ ssid.ssid }
                    label={ssid.ssid + " Password"}
                    // value={ wifiPassword[ssid].ssid }
                    onChange={(event:any) => { handleWifiPassword(event)}}
                    style={{width: 320}}
                    type="password"
                  /></span>
                }
                { connStatus && <span> { connStatus } <br /></span> }
                { ssid.rx_bitrate && <span>RX: { ssid.rx_bitrate } <br /> </span> }
                { ssid.tx_bitrate && <span>TX: { ssid.tx_bitrate } <br /> </span> }
                { ssid.tx_bitrate && <span><Button onClick={ () => wifiDisconnect( ssid.ssid ) } >Disconnect </Button><br /> </span> }

              </div>
            </div>
          ) :
          "Scanning..."
        }
        </DialogContent>
      </Dialog>
    </>
  );
}
