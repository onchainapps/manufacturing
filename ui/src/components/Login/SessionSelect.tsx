import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { InputLabel, MenuItem, FormHelperText, FormControl, Select, Button, TextField } from "@material-ui/core"; //tslint:disable-line
import { SpacePrinterAPI } from "../../api/SpacePrinterApis";
import { OgmiosWS } from "../../api/OgmiosApi";
import { KupoAPI } from "../../api/KupoApi";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      textAlign: "center",
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }),
);

export const SessionSelect: React.FC = () => {
  const classes = useStyles();
  const [sesstionType, setSessionType] = useState(sessionStorage.getItem("sessionType"));
  const [ ogmiosURI, setOgmiosURI ] = useState("ogmiostest.bakon.dev");
  const [ ogmiosPort, setOgmiosPort ] = useState("443");
  const [ kupoURI, setKupoURI ] = useState("kupotest.bakon.dev");
  const [ kupoPort, setKupoPort ] = useState("443");
  const [ status, setStatus ] = useState("");
  const [ apiKey, setApiKey ] = useState("");
  const [ serverSettingsShow, setServerSettingsShow ] = useState(false);
  const [ kupoHealth, setKupoHealth ] = useState(sessionStorage.getItem("kupoHealth"));
  const [ ogmiosHealh, setOgmiosHealth ] = useState(sessionStorage.getItem("ogmiosHealth"));
  const [ spHealth, setSPHealth ] = useState(sessionStorage.getItem("spaceprinterHealth"));
  const history = useHistory();

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSessionType(event.target.value as string);
    sessionStorage.setItem("sessionType", event.target.value as string)
  };
  
  const queryBackEnd = () => {
    setKupoHealth(sessionStorage.getItem("kupoHealth"));
    setOgmiosHealth(sessionStorage.getItem("ogmiosHealth"));
  };

  const setSelfHostParams = () => {
    if( ogmiosURI == "" ){ return(setStatus( "Provide Ogmios URI" )) };
    console.log("saving host name");
    sessionStorage.setItem("ogmiosURI", ogmiosURI);
    sessionStorage.setItem("ogmiosPort", ogmiosPort);
    sessionStorage.setItem("kupoURI", kupoURI);
    sessionStorage.setItem("kupoPort", kupoPort);
    sessionStorage.setItem("sessionType", "cardanobox");
    localStorage.setItem("darkMode", "true");
    localStorage.setItem("blockfrostApi", "testnetemH1u78at8jVJ0mFj3RnJUsradmzB56d");
  };

  useEffect( () => {
      setSelfHostParams();
      const timer = setInterval(() => {
        queryBackEnd();
      }, 5000);
      return () => clearInterval(timer);
      
  },[]);


  return (
    <>
    <div onClick={()=>setServerSettingsShow(true)} style={{ width: 400, margin: "10 auto", boxShadow:" 0px 0px 0px 1px rgba(255, 255, 255, 0.12)", borderRadius: "4px", cursor:"pointer" }}>Show Server Settings</div>
    {
    serverSettingsShow === true && 
    
    <div style={{ width: 400, margin: "10 auto", boxShadow:" 0px 0px 0px 1px rgba(255, 255, 255, 0.12)", borderRadius: "4px", padding: 25 }}>
    <div>
      <span>Space Printer Health: { spHealth && spHealth === "connected" ? <span style={{color: "green "}}> {spHealth} </span> : <span style={{color: "red "}}> {spHealth} </span>}</span>
      <div>
        <TextField
          variant="outlined"
          margin="dense"
          required
          id="spURI"
          name="spURI"
          label="Space Printer URI"
          value={window.location.hostname}
          disabled
          // onChange={(event:any) => {setOgmiosURI( event.target.value )}}
          style={{ height: "50px", width: "67%" }}
        />
      </div>
      <hr />
      <span>Ogmios Health: { ogmiosHealh && ogmiosHealh === "connected" ? <span style={{color: "green "}}> {ogmiosHealh} </span> : <span style={{color: "red "}}> {ogmiosHealh} </span>}</span>
      <div>
        <TextField
          variant="outlined"
          margin="dense"
          required
          id="ogmiosURI"
          name="ogmiosURI"
          label="Ogmios URI"
          value={ogmiosURI}
          onChange={(event:any) => {setOgmiosURI( event.target.value )}}
          style={{ height: "50px", width: "67%" }}
        />
        <TextField
          variant="outlined"
          margin="dense"
          required
          id="ogmiosPort"
          name="ogmiosPort"
          label="Ogmios Port"
          value={ogmiosPort}
          onChange={(event:any) => {setOgmiosPort( event.target.value )}}
          style={{ height: "50px", width: "33%" }}
        />
      </div>
      <hr />
      <span>Kupo Health: { kupoHealth && kupoHealth === "connected" ? <span style={{color: "green "}}> {kupoHealth} </span> : <span style={{color: "red "}}> {kupoHealth} </span>}</span>
      <div>
        
        <TextField
            variant="outlined"
            margin="dense"
            required
            id="kupoURI"
            name="kupoURI"
            label="Kupo URI"
            value={kupoURI}
            onChange={(event:any) => {setKupoURI( event.target.value )}}
            style={{ height: "50px", width: "67%" }}
        />
        <TextField
            variant="outlined"
            margin="dense"
            required
            id="kupoPort"
            name="kupoPort"
            label="Kupo Port"
            value={kupoPort}
            onChange={(event:any) => {setKupoPort( event.target.value )}}
            style={{ height: "50px", width: "33%" }}
        />
        
      </div>
      {/*
      <div>
        Not Active yet<br />
        <TextField
            variant="outlined"
            margin="dense"
            required
            id="apiKey"
            name="apiKey"
            label="Api Key"
            value={apiKey}
            onChange={(event:any) => {setApiKey( event.target.value )}}
            style={{ height: "50px", width: "67%" }}
        />                
      </div>
      */}
      <div>  
        <Button onClick={()=>setSelfHostParams()}>Save</Button>
        {status && <div>{status}</div>}
      </div>
    </div>
  </div>

    
    }

    </>
  );
};
