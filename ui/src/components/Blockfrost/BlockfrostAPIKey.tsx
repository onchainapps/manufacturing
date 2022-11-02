import React, { useState, useEffect } from "react";
import { Button, TextField } from "@material-ui/core";
import useDarkMode from "use-dark-mode";
import { blockfrostApi } from "../../api/SpacePrinterApis";
import { SpacePrinterAPI } from "../../api/SpacePrinterApis";

export const BlockfrostAPIKey: React.FC = ( ) => {
  const darkMode = useDarkMode();
  const [blockfrostApiKey, setBlockfrostApiKey ] = useState("");
  const [ status, setStatus ] = useState("");
  const [ viewPass, setViewPass ] = useState("password");

  const setKey = async () => {
    if( blockfrostApiKey === "" ){ return(setStatus( "Can't be balnk" ))};
    localStorage.setItem("blockfrostApi", blockfrostApiKey);
    const checkHealth: any = await blockfrostApi("https://cardano-testnet.blockfrost.io/api/v0/health", "GET", "");
    setStatus("saved");
    console.log(checkHealth);
  };

  const checkKey = async () => {
    const bfKey: any = sessionStorage.getItem("blockfrostApi");
    if( bfKey == undefined ){
      const userName: any = sessionStorage.getItem("userName");
      const jwToken: any = sessionStorage.getItem("jwtoken");
  
      const getBFKeyRes: any = await SpacePrinterAPI.editConfig( "", "", "bfAPi" );
      console.log(getBFKeyRes);
      getBFKeyRes.blockfrostApiKey !== "" && localStorage.setItem("blockfrostApi", getBFKeyRes.blockfrostApiKey);
      getBFKeyRes.blockfrostApiKey !== "" && setBlockfrostApiKey(getBFKeyRes.blockfrostApiKey);
    } 
  };

  useEffect(
    ()=>{
      checkKey()
  },[]);

  return(
    <>
      {
        blockfrostApiKey && blockfrostApiKey == "" &&
        <div style={{width: 400, margin: "10 auto", boxShadow:" 0px 0px 0px 1px rgba(255, 255, 255, 0.12)", borderRadius: "4px", padding: 25 }}>
          <div></div>
          Blockfrost API Key<br />
          <div>
            <TextField
              type={viewPass}
              variant="outlined"
              margin="dense"
              required
              id="blockfrostAPIKey"
              name="blockfrostAPIKey"
              label="Blockfrost API Key"
              value={blockfrostApiKey && blockfrostApiKey}
              
              onChange={(event:any) => {setBlockfrostApiKey(event.target.value)}}
            />
          </div>
          <div>
            https://blockfrost.io/
          </div>
          <div>
            <Button onClick={()=>setKey()}>Save</Button>
          </div>
          {status && <div>{status}</div>}
        </div>
      }
    </>
  );
};
