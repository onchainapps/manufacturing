import React from "react";
import { useHistory } from "react-router-dom";
import { MuiThemeProvider, AppBar, Toolbar, IconButton, Tooltip, Grid, Button } from "@material-ui/core";
import useDarkMode from "use-dark-mode";
import Brightness3Icon from "@material-ui/icons/Brightness3";
import WbSunnyIcon from "@material-ui/icons/WbSunny";
import { lightTheme, darkTheme } from "../../themes/theme";
import { useTranslation } from "react-i18next";
import LanguageMenu from "../LanguageMenu";
import {GetUpdates} from "../GetUpdates/GetUpdates";
import AppDrawer from "./AppDrawer";
// import header from "../../assets/header.jpg";
import LogoutBtn from "../LogoutBtn/LogoutBtn";

const NavBar: React.FC = () => {
  const darkMode = useDarkMode();
  const { t }:any = useTranslation();
  const theme = darkMode.value ? darkTheme : lightTheme;
  const history = useHistory();
  const [ sessionType, setSesstionType ] = React.useState(sessionStorage.getItem("sessionType"))
  return (
    <MuiThemeProvider theme={theme}>
      {/*<AppBar position="sticky" color="default" elevation={0}>*/}
      <AppBar color="default" elevation={0}>
        <Toolbar> 
          <Grid container>
            <Grid item>
              
            </Grid>
            <Grid item>
              <LanguageMenu />
              <Tooltip title={t("Toggle Dark Mode")}>
                <IconButton onClick={darkMode.toggle}>
                  {darkMode.value ? <Brightness3Icon /> : <WbSunnyIcon />}
                </IconButton>
              </Tooltip><br />

            </Grid>
          </Grid>
        </Toolbar>
        <Toolbar>
          <Grid container>
            <Grid item>
              <Button onClick={()=>history.push("/HomePage")} >Home</Button>
              <AppDrawer />
              <GetUpdates />
              <LogoutBtn />
            </Grid>
           </Grid>
        </Toolbar>
      </AppBar>
    </MuiThemeProvider >
  );
};

export default NavBar;
