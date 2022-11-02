import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core"; //tslint:disable-line
import useDarkMode from "use-dark-mode";
import { hex2a } from "../../utils/hextools";
import { parseOgmiosUtxos } from "../../utils/UTXOtools";
import { STLDialog } from "./STLDialog";

type walletProps = {
  jwToken: string
  address: any
}

const AddressInfo: React.FC<walletProps> = ( {jwToken, address  } ) => {
  const [ open, setOpen ] = useState( false );
  const [ status, setStatus ] = useState("Loading...");
  const [ parsedUtxos, setParsedUtxos ]:any = useState();
  const [ assets, setAssets ]: any = useState();
  const darkMode = useDarkMode();

  const handleClickOpen = async () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const getAddressInfo = async () => {
    const praseUtxoRes: any = await parseOgmiosUtxos(address);
    console.log(praseUtxoRes);
    setTimeout( () => {setParsedUtxos(praseUtxoRes) }, 3000) ;
  };

  useEffect( ()=>{
     getAddressInfo();
  },[])

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title">
        </DialogTitle>
        <DialogContent>
          <div>
            {
              parsedUtxos && console.log(parsedUtxos)
            }
            {
              assets && 
              <div>
                You can has this many ADAs: ₳{assets.lovelaceSum/1000000}
              </div>
            }
            {
              assets && assets.assets ? assets.assets.map( ( asset: any, key: any ) =>
                
                <div style={{border: "1px solid #fff", margin: 5, padding: 5}}>
                  { console.log(assets) }
                  TXIX: {asset.utxo}<br />
                  ADA: ₳{ asset.lovelace/1000000 }<br />
                  { asset.policyID && "Policy ID: " + asset.policyID}<br />
                  { asset.policyID && "Asset: " + hex2a(asset.asset)}({asset.asset})<br />
                  {  asset.policyID == undefined && "No Asset with UTXO"}<br />
                  CIP-26:
                  { asset.policyID && asset.meta.files && asset.meta.files.constructor == Array ? <>Yes <br/></> : <>No <br/></> }
                  { 
                    asset.policyID && asset.meta.files && asset.meta.files.constructor == Array ? 
                    asset.meta.files.map( (asset: any, key: any) =>
                      <>         
                        Media: {asset.mediaType}
                        {  asset.mediaType === "model/stl" && <STLDialog fileUrl={`https://ipfs.io/ipfs/${asset.src[0].replace("ipfs://","")}` } fileName="" stlName="" color="" type=""/> }
                        <br />
                      </>
                    )
                    :
                    <>
                      { asset.policyID && typeof asset.meta.files !== "undefined" && asset.meta.files.mediaType === "image/png"   && <img src={`https://ipfs.io/ipfs/${asset.meta.image.replace("ipfs://","")}`} alt="png file" height="50" /> }
                      { asset.policyID && typeof asset.meta.files !== "undefined" && asset.meta.files.mediaType === "image/jpeg"  && <img src={`https://ipfs.io/ipfs/${asset.meta.image.replace("ipfs://","")}`} alt="jpeg file" height="50" /> }
                      { asset.policyID && typeof asset.meta.files !== "undefined" && asset.meta.files.mediaType === "image/jpg"   && <img src={`https://ipfs.io/ipfs/${asset.meta.image.replace("ipfs://","")}`} alt="jpg" height="50"/> }
                    </>
                  }
                </div>
              )
              :
              <>LOADING...</>
            }
          </div>
        </DialogContent>
        <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        <Button onClick={()=>getAddressInfo()}>Refresh</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AddressInfo;