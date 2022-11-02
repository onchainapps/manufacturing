import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {MuiThemeProvider, CssBaseline, makeStyles, createStyles, Theme, TextField, Button, Link } from "@material-ui/core"; //tslint:disable-line
import useDarkMode from "use-dark-mode";
import { lightTheme, darkTheme } from "../../themes/theme";
import { SpacePrinterAPI } from "../../api/SpacePrinterApis";
import header from "../../assets/spaceprinter_logo_V1.png"
import "./CreateUserPage.css";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "absolute",
      top: "50%",
      left: "50%",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      textAlign: "center"
    }
  }),
);

const CreateUserPage: React.FC = () => {
  const darkMode = useDarkMode();
  const theme = darkMode.value ? darkTheme : lightTheme;
  const classes = useStyles();
  const [ userName, setUserName ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ accountType, setAccountType ]: any = useState("");
  const [ status, setStatus ] = useState("");
  const history = useHistory();

  const createUser = async () => {
    const createUserRes: any = await SpacePrinterAPI.createUser( userName, password );
    console.log(createUserRes);
    createUserRes.error && setStatus(createUserRes.error);
    createUserRes.changes &&  history.push("/LoginPage");
  };

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <div className={classes.root}>
        <div style={{textAlign: "center"}}>
          <img src={header} width="500" /> 
        </div>
        <div style={{textAlign: "center"}}>
          New User Account
        </div>
        <div style={{textAlign: "center"}}>
          <TextField
            variant="outlined"
            margin="dense"
            required
            id="username"
            name="username"
            label="username"
            value={userName}
            onChange={(event:any) => {setUserName( event.target.value )}}
            style={{ height: "50px" }}
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
            style={{ height: "50px" }}
          />
          <div>
            <Button variant="contained" onClick={()=>createUser()} >Create</Button>
          </div>
          <div style={{ position:"relative", right: 70}}>
            <Link href="#" color="primary" onClick={()=>history.push("/LoginPage")} >Back to Login</Link> 
          </div>
          <div>
            { status && status }
          </div>
        </div>

    </div>
    </MuiThemeProvider >
  );
};

export default CreateUserPage;
