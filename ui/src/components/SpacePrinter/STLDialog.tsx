import React, { useState, useRef } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core"; //tslint:disable-line
import useDarkMode from "use-dark-mode";
import { STLViewer } from "../AssetViewer/STLviewer";
import { GLTFViewer } from "../AssetViewer/GLTFviewer";
type dialogProps = {
  fileUrl: string;
  fileName: string;
  stlName: string;
  color: string;
  type: string;
}

export const STLDialog: React.FC<dialogProps> = ( { fileUrl, fileName, stlName, color, type } ) => {
  const [ open, setOpen ] = useState( false );
  const [ loading, setLoading ] = useState(true);
  const darkMode = useDarkMode();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen} style={{ width: 140 }}>
        {stlName !== "" ? stlName : "View STL"} <hr />{ type }
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth = { loading ? false : true }
        maxWidth="xl"
        
      >   
        <DialogTitle id="alert-dialog-title">
        </DialogTitle>
        <DialogContent>
          { type === "stl" && <STLViewer fileUrl={ fileUrl } fileName={ fileName } stlName={stlName} setLoading={setLoading} color={color} /> }
          { type === "gbl" && <GLTFViewer fileUrl={ fileUrl } fileName={ fileName } setLoading={setLoading} /> }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
