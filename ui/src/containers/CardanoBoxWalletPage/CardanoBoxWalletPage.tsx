import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { MuiThemeProvider, CssBaseline, createStyles, makeStyles, Theme } from "@material-ui/core"; //tslint:disable-line
import useDarkMode from "use-dark-mode";
import { lightTheme, darkTheme } from "../../themes/theme";
import AppDrawer from "../../components/NavBar/AppDrawer";
import AppDrawer2 from "../../components/NavBar/AppDrawer2";
import Wallets from "../../components/CardanoBoxWallet/Wallets";
import "./CardanoBoxWalletPage.css";

const CardanoBoxWalletPage: React.FC = () => {
  const darkMode = useDarkMode();
  const theme = darkMode.value ? darkTheme : lightTheme;
  const jwToken: any = sessionStorage.getItem("jwtoken");
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
  );
  const classes = useStyles();

  useEffect(()=>{
    jwToken == null && history.push("/LoginPage");
  });

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <AppDrawer2 pageName="WALLETTZZZ" />
      <div className={classes.main}>   
        <div style={{ margin: "0 50" }}>
          <Wallets />
        </div>
      </div>
    </MuiThemeProvider >
  );
};

export default CardanoBoxWalletPage;
