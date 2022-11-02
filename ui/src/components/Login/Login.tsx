import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {MuiThemeProvider, CssBaseline, makeStyles, createStyles, Theme, TextField, Button, Tooltip, Link } from "@material-ui/core"; //tslint:disable-line
import useDarkMode from "use-dark-mode";
import { lightTheme, darkTheme } from "../../themes/theme";
import { SpacePrinterAPI } from "../../api/SpacePrinterApis";

export const Login: React.FC = () => {
  const darkMode = useDarkMode();
  const theme = darkMode.value ? darkTheme : lightTheme;
  const [ userName, setUserName ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ status, setStatus ] = useState("");
  const history = useHistory();

  const login = async () => {
    const blockfrostApi: any = localStorage.getItem("blockfrostApi");
    const ogmiosURI: any = sessionStorage.getItem("ogmiosURI");
    const sessionType: any = sessionStorage.getItem("sessionType");

    if(userName === "") return setStatus("User name blank");
    if(password === "") return setStatus("Password blank");

    if( sessionType == null ){ return(setStatus( "Please select session type" ))};
    // if( blockfrostApi == null ){ return(setStatus( "Please set a Blockfrost API key" ))};
    
    let loginRes: any = await SpacePrinterAPI.loginUser( userName, password );
    console.log(loginRes);

    // Checks for different cases of no account errors
    if( loginRes == "noAccount" ) return setStatus( "No Account" );
    if( loginRes == "authError" ) return setStatus( "Try Again" );

    loginRes && loginRes.token && sessionStorage.setItem( 'userName', userName );
    loginRes && loginRes.token && sessionStorage.setItem( 'jwtoken', loginRes.token );
    loginRes && loginRes.token && setStatus("");
    loginRes && loginRes.token && history.push("/MainPage");
  };

  const resetUser = async () => {
    setStatus("Wiping User Data");
    const wipeRes: any = await SpacePrinterAPI.resetUser();
    sessionStorage.clear();
    localStorage.removeItem("blockfrostApi");
    console.log(wipeRes);
  };

  return (
    <div style={{width: 400, margin: "10 auto", boxShadow:" 0px 0px 0px 1px rgba(255, 255, 255, 0.12)", borderRadius: "4px", padding: 25, }}>
      <div>
        <TextField
          variant="outlined"
          margin="dense"
          required
          id="username"
          name="username"
          label="username"
          value={userName}
          onChange={(event:any) => {setUserName( event.target.value )}}
          style={{ height: "50px", width: "100%" }}
        />
        <br />
        <TextField
          variant="outlined"
          type="password"
          margin="dense"
          required
          id="password"
          name="password"
          label="password"
          value={password}
          onChange={(event:any) => {setPassword( event.target.value )}}
          style={{ height: "50px", width: "100%" }}
        />
        <div>
          <Button style={{ width: "100%" }} onClick={ ()=>login() }>Login</Button>
        </div>
        <div style={{textAlign: "left"}}>
          <Tooltip title={"Create new user account."}>
            <Link href="#" color="primary" onClick={()=>history.push("/CreateUserPage")}>
              Create Account
            </Link>
          </Tooltip>
          {" "}
          <Tooltip title={"This will wipe all accounts and wallets on Cardano Box but will leave your node data intact."}>
            <Link href="#" color="primary" onClick={()=>resetUser() } > 
              Reset Database
            </Link>
          </Tooltip>
        </div>
        <div>
          { status && status }
        </div>
      </div>
    </div>
  );
};