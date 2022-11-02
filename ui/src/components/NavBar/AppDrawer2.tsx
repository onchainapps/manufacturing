import React, { useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles, useTheme, Theme, createStyles, Typography, Toolbar, IconButton, Drawer, Divider, AppBar, Button, Tooltip } from '@material-ui/core';
import Hidden from '@mui/material/Hidden';
import MenuIcon from '@material-ui/icons/Menu';
import { useHistory } from "react-router-dom";
import useDarkMode from "use-dark-mode";
import Brightness3Icon from "@material-ui/icons/Brightness3";
import WbSunnyIcon from "@material-ui/icons/WbSunny";
import { lightTheme, darkTheme } from "../../themes/theme";
import { useTranslation } from "react-i18next";
import LanguageMenu from "../LanguageMenu";
import cbheader from "../../assets/spaceprinter_logo_V1.png";
import cbicon from "../../assets/sp_icon_logo_V1.png";
import LogoutBtn from "../LogoutBtn/LogoutBtn";
import { SettingsMenu } from "./SettingsMenu";
import { PrinterMenu } from "./PrinterMenu";
import { NewWalletPopup } from "../CardanoBoxWallet/NewWalletPopup";

const drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      marginBottom: "25px"
    },
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    appBar: {
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  }),
);

type DrawerProps = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window,
  pageName: String,
  children?: React.ReactNode,
}

const ResponsiveDrawer:React.FC<DrawerProps> = ({ window, pageName, children }) => {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = useState(false);
  const darkMode = useDarkMode();
  const { t }:any = useTranslation();
  const theme = darkMode.value ? darkTheme : lightTheme;
  const history = useHistory();
  const [ sessionType, setSessionType ] = useState(sessionStorage.getItem("sessionType"))
  const [ version, setVersion ] = useState("v0.7.0-beta");

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div style={{textAlign: "center", height: "100%" }}>
      <div style={{marginTop: 10}}>
        <img src ={cbheader} height="30" />
      </div>
      <div className={classes.toolbar} />
      <div>
        <List>
          <ListItem onClick={()=>history.push("/MainPage")} button>
            <ListItemIcon><img src={cbicon} height="40" /></ListItemIcon>
            <ListItemText primary="Main" />
          </ListItem>
          <ListItem button>
            <ListItemIcon><img src={cbicon} height="40" /></ListItemIcon>
            <PrinterMenu />
          </ListItem>
          <ListItem button>
            <ListItemIcon><img src={cbicon} height="40" /></ListItemIcon>
            <SettingsMenu />
          </ListItem>
          <ListItem button>
            <ListItemIcon><img src={cbicon} height="40" /></ListItemIcon>
            <LogoutBtn />
          </ListItem>
        </List>
      </div>
      <div style={{position: "absolute", bottom: "3px", width:"100%", textAlign: "center" }} >
        <LanguageMenu />
        <Tooltip title={t("Toggle Dark Mode")}>
          <IconButton onClick={darkMode.toggle}>
            {darkMode.value ? <Brightness3Icon /> : <WbSunnyIcon />}
          </IconButton>
        </Tooltip><br />
        Version: { version && version }
      </div>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {pageName}
          </Typography>
          {pageName === "WALLETTZZZ" && <><NewWalletPopup /><Button color="primary" style={{position: "absolute", right: 15}}>REFRESH</Button></>}
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <div className={classes.toolbar} />
      <br/>
    </div>
  );
}

export default ResponsiveDrawer;