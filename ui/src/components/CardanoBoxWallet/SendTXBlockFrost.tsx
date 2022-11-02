import React, { useState, useRef } from "react";
import { SpacePrinterAPI, SpacePrinterWSS, blockfrostApi } from "../../api/SpacePrinterApis";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core"; //tslint:disable-line
import useDarkMode from "use-dark-mode";
import  star  from "../../assets/sticker.webp";
import CircularProgress from '@material-ui/core/CircularProgress';

type SendTXProps = {
  jwToken: any,
  txResult: any,
  getAddressInfo: any,
}

export const SendTXBlockFrost: React.FC<SendTXProps> = ({ jwToken, txResult, getAddressInfo }) => {
  const [ status, setStatus ] = useState("Loading...");
  const darkMode = useDarkMode();
  const [ fee, setFee ] = useState();
  const [ txid, setTxid ]: any = useState();
  const [ txInfo, setTXinfo ]: any = useState();
  const [ mempool, setMempool ]: any = useState();
  const [ open, setOpen ] = useState(false);
  let refreshTimer:any = useRef();

  const handleOpen = () => {
    setOpen(true)
    sendTX();
  };

  const handleClose = () => {
    StopTXInfoPoll();
    getAddressInfo();
    setOpen(false);
  };

  const sendTX = async () => {
    const blockfrostres: any = await blockfrostApi(`https://cardano-testnet.blockfrost.io/api/v0/tx/submit`, "POST", txResult.cborHex);
    console.log(blockfrostres);
    blockfrostres.error ? setTxid(blockfrostres.error) : startTXInfoPoll(blockfrostres);
  };

  const getTXInfo = async ( txHash: any ) => {
    const queryTXres: any = await blockfrostApi(`https://cardano-testnet.blockfrost.io/api/v0/txs/${txHash}`, "GET", "");
    console.log(queryTXres);
    queryTXres.hash && StopTXInfoPoll();
    queryTXres.hash && setTXinfo(queryTXres);
  };

  const startTXInfoPoll: any = async ( txHash: any ) => {
    getTXInfo( txHash );
    setTxid(txHash);
    const txPollTimer: any = setInterval(() => {
      getTXInfo( txHash );
    }, 10000);
    refreshTimer.current = txPollTimer;
  };
  const StopTXInfoPoll: any  = async () => {
    clearInterval(refreshTimer.current);
  };

  return (
    <>
      <Button onClick={handleOpen}>Send Using BF</Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title">
        </DialogTitle>
        <DialogContent>
          <div style={{maxWidth: 700, wordWrap: "break-word"}}>
          { txInfo && txInfo.slot ?
            <div>
              <div>
                <img src={star} height="400" />
              </div>
              <div>
                View TX on https://cardanoscan.io/ <br/>
                <a href={`https://testnet.cardanoscan.io/transaction/${txid}`} target="_blank">{txid}</a>
              </div>
            </div>
            :
            txid && txid.error ?  
            <div>
              error: { txid.error }<br />
            </div>
            :
            <div>
              txid: { txid }<br />
              <CircularProgress disableShrink />
            </div>
          }
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
