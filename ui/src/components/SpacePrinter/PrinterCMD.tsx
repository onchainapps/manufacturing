import React, { useState } from "react";
import { SpacePrinterAPI, SpacePrinterWSS } from "../../api/SpacePrinterApis";
import { TextField, Button, InputLabel, MenuItem, FormControl, Select } from "@material-ui/core"; 
import useDarkMode from "use-dark-mode";


const PrinterCMD: React.FC = () => {
  const [ printerCMD, setPrinterCMD ] = useState<string>("");
  const [ status, setStatus ] = useState();
  const darkMode = useDarkMode();  
  
  const selectNewCMD = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPrinterCMD(event.target.value as string);
  };

  const sendCMD = async () => {
    const jwtoken: any = sessionStorage.getItem("jwtoken");
    const userName: any = sessionStorage.getItem("userName");
    try{
      const cmdResult: any = await SpacePrinterAPI.sendCmdToPrinter( jwtoken, userName, printerCMD );
      console.log(cmdResult);
      cmdResult.stderr != "" && setStatus(cmdResult.stderr);
    }catch(error){
      console.log(error);
    };
  };

  const openSerial = async () => {
    SpacePrinterWSS.send( JSON.stringify( { jsonrpc: '2.0', method: 'serialPort', params: [ "open" ] } ) );
  };
  const closeSerial = () => {
    SpacePrinterWSS.send( JSON.stringify( { jsonrpc: '2.0', method: 'serialPort', params: [ "close" ] } ) );
  };

  return (
    <>
      <div style={{ border: `1px dashed ${darkMode.value ? "#fff" : "#000"}`, borderRadius: 5, padding: 10, width: "800px",}}>
        <TextField
          variant="outlined"
          margin="dense"
          required
          id="printerCMD"
          name="printerCMD"
          label="Printer Command"
          value={printerCMD}
          style={{width: 400}}
          onChange={(event:any) => {setPrinterCMD(event.target.value)}}
        />
        <FormControl style={{ minWidth: 120 }}>
          <InputLabel id="demo-simple-select-label">Commands</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={printerCMD}
            onChange={selectNewCMD}
          >
            <MenuItem value="M115">M115 - Get Printer Info(UUID)</MenuItem>
            <MenuItem value="G28">G28 - Auto Home</MenuItem>
          </Select>
        </FormControl>        
        {status && status }<br />

        <Button variant="outlined" onClick={()=>openSerial()}>Connect</Button>
        <Button variant="outlined" onClick={()=>sendCMD()}>Send</Button>
        <Button variant="outlined" onClick={()=>closeSerial()}>Close</Button>
        <div>Hook up your printer to Cardano Box and press connect. To get more printer info type in <code>M115</code> and press send</div>
      </div>
      
    </>
  ) 
}

export default PrinterCMD;