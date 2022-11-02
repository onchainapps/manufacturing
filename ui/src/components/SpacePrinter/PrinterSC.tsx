import React, { useEffect, useState } from "react";
import { SpacePrinterAPI, blockfrostApi } from "../../api/SpacePrinterApis";
import { makeStyles, Checkbox, FormControlLabel, Button, IconButton } from "@material-ui/core";
import useDarkMode from "use-dark-mode";
import { a2hex, hex2a } from "../../utils/hextools";
import { parseOgmiosUtxos } from "../../utils/UTXOtools";
import { PrintJobsTable } from "./PrintJobsTable";
import { OgmiosWS } from "../../api/OgmiosApi";
import RefreshIcon from '@material-ui/icons/Refresh';

export const PrinterSC: React.FC = () => {
  const darkMode = useDarkMode();
  const [ parsedUtxos, setParsedUtxos ]:any = useState([]);

  const getAddressInfo = async () => {
    // const address = "addr_test1wrxf5ul7h3sf095u8a6fsh2y9sm8lfjj26s4x9gk4mm0wvqkxf5hp";
    const address = "addr_test1qzsuzrz8v7nrleyc8uvg946dzyr99608xdw5nk64l98fss06qc7n0m9a2l0rxvmgeunvkqm2zzqq8zl3yn5jwqm3t44qqudqtt"
    let praseUtxoRes: any = await parseOgmiosUtxos(address);
    console.log(praseUtxoRes);

    setTimeout( () => { 
      setParsedUtxos(praseUtxoRes);
    }, 3000) ;
    console.log(praseUtxoRes);
  };

  useEffect(()=>{
    getAddressInfo();
  }, [])

  return(
    <>
      Print Jobs Available: <IconButton onClick={()=>getAddressInfo()}><RefreshIcon /></IconButton>
      <div >
        { parsedUtxos.length > 0 && parsedUtxos !== "error" ? <PrintJobsTable rows={parsedUtxos} /> : <>LOADING...</>}
      </div>
    </>
  )
};
