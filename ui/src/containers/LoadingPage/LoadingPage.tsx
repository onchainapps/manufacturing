import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { MuiThemeProvider, CssBaseline } from "@material-ui/core";
import useDarkMode from "use-dark-mode";
import { lightTheme, darkTheme } from "../../themes/theme";
import NavBar from "../../components/NavBar/NavBar";
import { SpacePrinterAPI } from "../../api/SpacePrinterApis";

import "./LoadingPage.css";

const LoadingPage: React.FC = () => {
  const darkMode = useDarkMode();
  const theme = darkMode.value ? darkTheme : lightTheme;
  const history = useHistory();
  const [status, setStatus] = useState("INITILIZING SYSTEM...")

  const checkForAddress = async () => {
    const checkjwt: string|null = sessionStorage.getItem("jwtoken");
    console.log(checkjwt);
    checkjwt ? history.push("/HomePage") : history.push("/LoginPage")

  };

  useEffect( () => {
    checkForAddress();// eslint-disable-next-line
  }, []);

  return (
    <MuiThemeProvider theme={theme}>
      <div><NavBar /></div>
      <div>
        <CssBaseline />
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", minHeight: "100vh" }}>
          {status}
        </div>
      </div>
    </MuiThemeProvider >
  );
};

export default LoadingPage;
