import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { MuiThemeProvider, CssBaseline, createStyles, makeStyles, Theme } from "@material-ui/core"; //tslint:disable-line
import useDarkMode from "use-dark-mode";
import { lightTheme, darkTheme } from "../../themes/theme";
import NavBar from "../../components/NavBar/NavBar";
import { PrinterWalletSetup } from "../../components/SpacePrinter/PrinterWalletSetup";
import AppDrawer2 from "../../components/NavBar/AppDrawer2";
import "./PrinterWalletSetupPage.css";

const GenPrinterWalletPage: React.FC = () => {
  const darkMode = useDarkMode();
  const theme = darkMode.value ? darkTheme : lightTheme;
  const jwToken: null|string = sessionStorage.getItem("jwtoken");
  const history = useHistory();
  const drawerWidth = 265;
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      main: {
        [theme.breakpoints.up('sm')]: {
          width: `calc(100% - ${drawerWidth}px)`,
          marginLeft: drawerWidth,
          justifyContent: "center", 
          alignItems: "center", 
          textAlign: "center"
        },
      },
    })
  )

  const classes = useStyles();

  useEffect(()=>{
    jwToken == null && history.push("/LoginPage");
  });

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <AppDrawer2 pageName="Printer Wallet Setup"/>
      <div className={classes.main}>
        <div>
          <PrinterWalletSetup  />
        </div>
      </div>
    </MuiThemeProvider >
  );
};

export default GenPrinterWalletPage;
