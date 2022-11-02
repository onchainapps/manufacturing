import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core"; //tslint:disable-line
import useDarkMode from "use-dark-mode";
import { lightTheme, darkTheme } from "../../themes/theme";


export const Updates: React.FC = () => {
  const darkMode = useDarkMode();
  const drawerWidth = 265;
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      main: {
        [theme.breakpoints.up('sm')]: {
          width: `calc(100% - ${drawerWidth}px)`,
          marginLeft: drawerWidth,
          borderRadius: 5, 
          padding: 5, 
          overflow: "hidden", 
          justifyContent: "center", 
          alignItems: "center", 
          textAlign: "center",
          maxWidth: 700,
        },
      },
    })
  );

  const theme = darkMode.value ? darkTheme : lightTheme;
  const history = useHistory();
  const classes = useStyles();

  return (
    <>
      <div style={{ border: `1px dashed ${darkMode.value ? "#fff" : "#000"}`, borderRadius: 5, padding: 5, margin: 15, overflow: "hidden", justifyContent: "center", alignItems: "center", textAlign: "left" }}>
        <strong>v0.7.0-beta</strong>:<br />
        -No more blockfrost API key needed, switched to noderunner
      </div>
      <div style={{ border: `1px dashed ${darkMode.value ? "#fff" : "#000"}`, borderRadius: 5, padding: 5, margin: 15, overflow: "hidden", justifyContent: "center", alignItems: "center", textAlign: "left" }}>
        <strong>v0.6.1-beta</strong>:<br />
        -Blockfrost API Key health check. <a href="https://github.com/adosia/spaceprinter/issues/8" target="_blank" >issue #8</a><br />
        -STL Viewer now does a better job of zooming the part out and trying to set a new anchor point. <a href="https://github.com/adosia/spaceprinter/issues/7" target="_blank" >issue #7</a> <br />
        -Saving STL from wallet now saves it with proper name and .stl extension. <a href="https://github.com/adosia/spaceprinter/issues/6" target="_blank" >issue #6</a>
      </div>
      <div style={{ border: `1px dashed ${darkMode.value ? "#fff" : "#000"}`, borderRadius: 5, padding: 5, margin: 15, overflow: "hidden", justifyContent: "center", alignItems: "center", textAlign: "left" }}>
        <strong>v0.6.0-beta</strong>:<br />
        -New Login Screen<br />
        -Option for self hosted ogmios<br />
        -SSL anb SSL Generator.<br />
        -Option to update Blockfrost API key from device settings.<br/>
        -New update client which allows for updating major releases without the need of burning image file.<br/>
        -Auto scroll added to printer terminal window.<br/>
        -Jobs section switched to new smart contract address.<br/>
        -Manually Generate SSL<br/>
        -New SSL Cert created when changing device name to match new local domain name.<br/>
        -New SSL Cert created when updating to new version.
      </div>
      <div style={{ border: `1px dashed ${darkMode.value ? "#fff" : "#000"}`, borderRadius: 5, padding: 5, margin: 15, overflow: "hidden", justifyContent: "center", alignItems: "center", textAlign: "left" }}>
        <strong>v0.5.1-beta</strong>:<br/>
        -UI Fixes and enhancements.<br />
        -Wallet Fixes for properly selecting UTXOs and Assets and creating outputs.<br/>
        -Need to check confirm cehckbox for default restore.<br />
        -Popup confirmation when deleting wallet.
      </div>
      <div style={{ border: `1px dashed ${darkMode.value ? "#fff" : "#000"}`, borderRadius: 5, padding: 5, margin: 15, overflow: "hidden", justifyContent: "center", alignItems: "center", textAlign: "left" }}>
        <strong>v0.5-beta</strong>:<br/>
        -Cardano Box wallet ported with full blockfrost support.<br />
        -ReWorked menus(Need input)<br />
        -Several bugs and errors now have try/catch blocks to prevent memory or hangups when function errors.
      </div>
      <div style={{ border: `1px dashed ${darkMode.value ? "#fff" : "#000"}`, borderRadius: 5, padding: 5, margin: 15, overflow: "hidden", justifyContent: "center", alignItems: "center", textAlign: "left" }}>
        <strong>v0.4-beta</strong>:<br/>
        -Working CSL(Cardano Serialization Library) transaction builder imported from Cardano Box. Allows for creating TXs to interact with Smart Contracts.<br />
        -Headless setup through editing hlConfig.json that's on the device space printer image has been burned to.<br />
        -Auto detect for external DSI or HDMI monitor. Monitor/Screen has to be attached before powering on device.
      </div>
      <div style={{ border: `1px dashed ${darkMode.value ? "#fff" : "#000"}`, borderRadius: 5, padding: 5, margin: 15, overflow: "hidden", justifyContent: "center", alignItems: "center", textAlign: "left" }}>
        <strong>BETA V.03</strong>:<br/>
          New Settings Menu.<br />
          Give device a unique name for easier managment.<br />
          WiFi Connection GUI(Not Tested with 5Ghz Networks).
      </div>
      <div style={{ border: `1px dashed ${darkMode.value ? "#fff" : "#000"}`, borderRadius: 5, padding: 5, margin: 15, overflow: "hidden", justifyContent: "center", alignItems: "center", textAlign: "left" }}>
        <strong>BETA V.02</strong>:<br/>
        Support for multi devices
      </div>
      <div style={{ border: `1px dashed ${darkMode.value ? "#fff" : "#000"}`, borderRadius: 5, padding: 5, margin: 15, overflow: "hidden", justifyContent: "center", alignItems: "center", textAlign: "left" }}>
        <strong>BETA V.01</strong>:<br/>
        Rebased on new kernel and distro for better streamlining and gettings RC1 ready.
      </div>
    </>
  );
};
