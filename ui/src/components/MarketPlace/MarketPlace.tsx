import React from "react";
import { } from "@material-ui/core"; //tslint:disable-line
import useDarkMode from "use-dark-mode";

const MarketPlace: React.FC = () => {
  const darkMode = useDarkMode();
  
  const printAbles: any = {
    "items": {
        "smlplug": {
          "name": "Small Plug", 
          "cost": "5 ADA",
          "image": ""
        },
        "lrgplug": {
          "name": "Large Plug",
          "cost": "30 ADA",
          "image": ""
       }
      }
    }


  return (
    <div style={{ margin: 10 }}>
      Available/Requested Prints:
      <div style={{ border: `1px dashed ${darkMode.value ? "#fff" : "#000"}`, borderRadius: 5, padding: 5, overflow: "hidden"  }}>
        {
          Object.keys(printAbles.items).map((item: any, i: any) =>(
            <div  key={i} style={{ float: "left",border: `1px dashed ${darkMode.value ? "#fff" : "#000"}`, borderRadius: 5, margin: 5, padding: 5 }}>
              <b>Name: </b>  { printAbles.items[item].name }<br />
              <b>Cost: </b>  { printAbles.items[item].cost }
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default MarketPlace;
