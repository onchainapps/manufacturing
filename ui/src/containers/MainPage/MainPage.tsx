import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { MuiThemeProvider, CssBaseline, createStyles, makeStyles, Theme } from "@material-ui/core"; //tslint:disable-line
import useDarkMode from "use-dark-mode";
import { lightTheme, darkTheme } from "../../themes/theme";
import AppDrawer from "../../components/NavBar/AppDrawer";
import AppDrawer2 from "../../components/NavBar/AppDrawer2";
import { Updates } from "../../components/GetUpdates/Updates";
import { WelcomePopup } from  "../../components/WelcomePopup/WelcomePopup";
import "./MainPage.css";

const MainPage: React.FC = () => {
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
  const jwToken: any = sessionStorage.getItem("jwtoken");
  const history = useHistory();
  const classes = useStyles();

  useEffect(()=>{
    jwToken == null && history.push("/LoginPage");
  });

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <AppDrawer2 pageName="Main" />
      <div className={classes.main}>
        <Updates />
        <WelcomePopup />
      </div>
    </MuiThemeProvider >
  );
};

export default MainPage;
