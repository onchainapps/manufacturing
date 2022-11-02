import React, { useEffect, useState, useRef } from "react";
import { SpacePrinterAPI, SpacePrinterWSS } from "../../api/SpacePrinterApis";
import { makeStyles } from "@material-ui/core"; //tslint:disable-line
import useDarkMode from "use-dark-mode";
import PrinterCMD from "./PrinterCMD";

type PrinterProps = {
  setPrinterUUID: any
}

export const PrinterTerminal:React.FC<PrinterProps> = ({ setPrinterUUID }) => {
  const darkMode = useDarkMode();  
  const useStyles = makeStyles({
    terminal: {
      width: 800,
      height: 400,
      padding: 10,
      background: `${darkMode.value ? "#fff" : "#000" }`,
      color: `${darkMode.value ? "#000" : "#0f0" }`,
      borderRadius: 10,
      border: `1px dashed ${darkMode.value ? "#fff" : "#000"}`,
      fontFamily: "monospace",
      textAlign: "left",
      overflow: "auto",
      margin: "0 auto",
      cursor: "text"
    },
  });

  const [ printerConnInfo, setPrinterConnInfo ]:any = useState<any>([]);
  const classes = useStyles(); 
 
  
  const printerConnect: any = async () => {
    console.log("getting printer info");
    try{
      SpacePrinterWSS.onmessage = async ( data: any ) => {
        data = JSON.parse(data.data);
        // console.log(data);
        data.error ? setPrinterConnInfo( (printerConnInfo: any) => [...printerConnInfo,  data.error ]) :
        data.method && data.method == "serialPort" && setPrinterConnInfo( (printerConnInfo: any) => [...printerConnInfo,  data.result ]);
        let myRegexp: any = /UUID:(.*)/; 
        // console.log(myRegexp)
        let uuid = await myRegexp.exec(data.result !== undefined && data.result[0]);
        uuid !== null && console.log(uuid[1])
        uuid !== null && setPrinterUUID(uuid[1]);
      };
    }catch( error ){
      console.log(error)
    }
  };
  
  useEffect( () => {
    printerConnect()
  }, []);

  useEffect( () => {
    let objDiv: any = document.getElementById("term");
    objDiv.scrollTop = objDiv.scrollHeight;
  });

  return(
    <div style={{width: 800}}>
      Printer Terminal: 
      <div id="term" className={classes.terminal} >
        { 
          printerConnInfo && 
          printerConnInfo.map((line: any, key: any) => 
            <>{line}<br/></>
          )
        }
      </div>
      <div style={{margin: "5 auto", width: 800}}>
        <PrinterCMD />
      </div>
    </div>
  )
}
