import React from "react";
import {MuiThemeProvider, CssBaseline, makeStyles, createStyles, Theme, ButtonBase} from "@material-ui/core"; //tslint:disable-line
import useDarkMode from "use-dark-mode";
import { lightTheme, darkTheme } from "../../themes/theme";
import { Login } from "../../components/Login/Login";
import { SessionSelect } from "../../components/Login/SessionSelect";
import { BlockfrostAPIKey } from "../../components/Blockfrost/BlockfrostAPIKey";
import header from "../../assets/spaceprinter_logo_V1.png"
import "./LoginPage.css";

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

const LoginPage: React.FC = () => {
  const darkMode = useDarkMode();
  const theme = darkMode.value ? darkTheme : lightTheme;
  const classes = useStyles();
  
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <div className={classes.root}>
        <div style={{textAlign: "center"}}>
          <img src={header} width="300" /> 
        </div>
        <div>
          <Login />
        </div>
        <div>
          <SessionSelect />
        </div>
        <div>
          FireFox User: If you can't login when using https://. <br />
          Please click the link below and accept self signed certificate.<br />
          <ButtonBase onClick={()=>window.location.assign("https://" + window.location.hostname + ":4442")}>https://{window.location.hostname}:4442</ButtonBase>
        </div>
      </div>
    </MuiThemeProvider >
  );
};

export default LoginPage;
