import React from 'react';
import { SpacePrinterAPI } from "../../api/SpacePrinterApis";
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { Button, Dialog, Typography, Tooltip } from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { CreateWallet } from "./CreateWallet";
import { RecoverSeed } from "./RecoverSeed";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

type DelWalletPopupProps = {
  walletID: string,
  queryWallets: any,
}


export const DelWalletPopup: React.FC<DelWalletPopupProps> = ({ walletID, queryWallets }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    console.log(walletID)
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const delWallet: any  = async ( walletID: string ) => {
    const jwToken: any = sessionStorage.getItem("jwtoken");
    const userName: any = sessionStorage.getItem("userName");
    try{
      const delRes: string = await SpacePrinterAPI.delCBWallet( jwToken, userName, walletID, "" );
      console.log(delRes);
      queryWallets();
    }catch( error ){
      console.log(error)
    }
  };

  return (
    <>
      <Button style={{ background: "#930006"}} onClick={handleClickOpen}>
        Delete
      </Button>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogContent dividers>
          <div>
            This will delete your wallet, if you don't have your seed phrase saved you will not be able to recover this wallet any more!!!!
          </div>
          <div style={{ textAlign: "center" }}>
          <Button onClick={ ()=>{ delWallet( walletID )}} >Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
