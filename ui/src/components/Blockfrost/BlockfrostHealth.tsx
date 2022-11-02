import React, { useState, useEffect } from "react";
import { Button, TextField } from "@material-ui/core";
import useDarkMode from "use-dark-mode";
import { blockfrostApi } from "../../api/SpacePrinterApis";
import { SpacePrinterAPI } from "../../api/SpacePrinterApis";

export const BlockfrostHealth: React.FC = ( ) => {
  const darkMode = useDarkMode();
  const [blockfrostHealth, setBlockfrostHealth ] = useState("Checking Status");
  const [ status, setStatus ] = useState("");
  const [ viewPass, setViewPass ] = useState("password");

  const checkKey = async () => {
    const BFHealthRes = await blockfrostApi("https://cardano-testnet.blockfrost.io/api/v0/", "GET", "");
    console.log("BF Heatlh", BFHealthRes);
    BFHealthRes.error ? setBlockfrostHealth("Blockfrost (Eror)") : setBlockfrostHealth("Blockfrost (Online)");
  };

  useEffect(
    ()=>{
      checkKey()
  },[]);

  return(
    <>
      { blockfrostHealth && blockfrostHealth }
    </>
  );
};
