import React, {useEffect} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useHistory } from "react-router-dom";
import { SpacePrinterAPI } from "../../api/SpacePrinterApis";

export const WelcomePopup = () => {
  const [open, setOpen] = React.useState(false);
  const history = useHistory();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const checkForPrinterWallet = async () => {
    const jwToken: any = sessionStorage.getItem("jwtoken");
    const userName: any = sessionStorage.getItem("userName");
    let exists: any = 0;
    try{
      const walletsResult: any = await SpacePrinterAPI.getCBWallets( jwToken, userName, "" );
      console.log(walletsResult);
      walletsResult == "authError" && history.push("/LoginPage");
      await walletsResult.map((wallet: any ) => {
        wallet.walletType === "printer" ? exists = 1 : exists = 0;
      });

      exists === 0 && setOpen(true);

      console.log("exists", exists)
      
    }catch( error ){
      console.log(error);
    };
  };

  useEffect(()=>{
    checkForPrinterWallet();
  }, []);

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open alert dialog
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Welcome Printer Operator</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div>
                <div>
                    Hi, <br/><br/>
                    
                    It seems like you don't have a printer wallet created. A wallet for your printer is not necessary to use Space Printer.<br/>
                    But without one you will not be able to interact with the Adosia Market Place to full fill orders<br/><br/>

                    Please select one of the options below to continue.
                </div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>{history.push("/PrinterWalletSetupPage");}} color="primary">
            Create Printer Wallet
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Not Now
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
