import React, { useEffect } from "react";
import { } from "@material-ui/core"; //tslint:disable-line

declare global {
  interface Window {
      kiri:any;
  }
}

const Slicer: React.FC = () => {

  let openFrame: any = () => { 

    let slicerFrame: any = document.getElementById("slicerDiv");
    let iframe = document.createElement("iframe");
    // iframe.src = `http://cardanobox:8080/kiri/`;
    iframe.src = `https://grid.space/kiri/`;
    iframe.id = "iframe";
    iframe.style.height = "800px";
    iframe.style.width = "100%";
    slicerFrame.appendChild(iframe);
  };

  useEffect(()=>{
    openFrame();
  }, []);

  return (
    <div id="slicerDiv"></div>
  );
};

export default Slicer;
