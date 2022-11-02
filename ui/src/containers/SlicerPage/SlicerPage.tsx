import React from "react";
import { useHistory } from "react-router-dom";
import useDarkMode from "use-dark-mode";
import { lightTheme, darkTheme } from "../../themes/theme";
import { MuiThemeProvider, CssBaseline, createStyles, makeStyles, Theme} from "@material-ui/core"; //tslint:disable-line
import AppDrawer2 from "../../components/NavBar/AppDrawer2";
import "./SlicerPage.css";
import Slicer from "../../components/Slicer/Slicer"

const SlicerPage: React.FC = () => {
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
  
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <AppDrawer2 pageName="Printer"/>
      <div className={classes.main}>
        <div>
          <Slicer />
        </div>
      </div>
    </MuiThemeProvider >
  );
};

export default SlicerPage;
