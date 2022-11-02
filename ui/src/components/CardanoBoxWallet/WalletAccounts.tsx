import React, { useState } from "react";
import { SpacePrinterAPI, SpacePrinterWSS } from "../../api/SpacePrinterApis";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@material-ui/core";
import { hex2a } from "../../utils/hextools";
import GenWalletAccount from "./GenWalletAccount";
import AddressInfo from "./AddressInfo";
import { AccountTabs } from "./AccountTabs";

type WalletAccountsProps = {
  walletInfo: any,
}

export const WalletAccounts: React.FC<WalletAccountsProps> = ( { walletInfo } ) => {
  const useStyles = makeStyles({
    root: {
      width: '100%',
    },
    container: {
      maxHeight: 400,
    },
    button:{
      background: "#930006"
    }
  });
  const columns: any[] = [
    { id: "accountName", label: 'Account Name', minWidth: 100 },
    { id: "Address", label: 'Address', minWidth: 100 },
    { id: "accountIndex", label: 'Index', minWidth: 100 },
    { id: "created", label: 'Created', minWidth: 100 },
    { minWidth:100 },
  ];
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);

  const [ accounts, setAccounts ] = useState([]);
  const [ open, setOpen ] = useState( false );
  const jwToken: any = sessionStorage.getItem("jwtoken");

  const handleClickOpen = () => {
    setOpen(true);
    getWalletAccounts();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  
  const getWalletAccounts = async () => {
    const jwToken: any = sessionStorage.getItem("jwtoken");
    const userName: any = sessionStorage.getItem("userName");
    const walletAccRes: any = await SpacePrinterAPI.getCBWallets( jwToken, userName, walletInfo.walletID );
    console.log(walletAccRes);
    setAccounts(walletAccRes);
  };

  const delWalletAccount = async ( accountName: string ) => {
    const jwToken: any = sessionStorage.getItem("jwtoken");
    const userName: any = sessionStorage.getItem("userName");
    const delRes: string = await SpacePrinterAPI.delCBWallet( jwToken, userName, walletInfo.walletID, accountName );
    console.log(delRes);
    getWalletAccounts();
  };

  return (
    <>
    <Button color="primary" onClick={handleClickOpen}>
      Open
    </Button>
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth="xl"
    >   
      <DialogTitle id="alert-dialog-title">
        Accounts for wallet: { walletInfo.walletName }<br />
      </DialogTitle>
      <DialogContent>
      <div> 
      <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table" >
          <TableHead >
            <TableRow >
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            { accounts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: any) => {
              // console.log(row)
              return(
              <TableRow hover role="checkbox" tabIndex={-1} key={row.walletId}>
                <TableCell component="th" scope="row">
                  { row.accountName }
                </TableCell>
                <TableCell align="left">
                  Base: { row.baseAddr } <br />
                  Enterprise: { row.enterpriseAddr }<br />
                  Stake: {row.rewardAddr}<br />
                  Pointer: {row.pointerAddr}
                </TableCell>
                <TableCell align="left">
                  {row.accountIndex}
                </TableCell>
                <TableCell align="left">
                  { new Date(row.timeCreated*1000).toLocaleTimeString("en-US")} | { new Date(row.timeCreated*1000).toLocaleDateString("en-US") }
                </TableCell>
                <TableCell align="right">
                  <AccountTabs jwToken={jwToken} address={row.baseAddr} accountName={row.accountName} walletID={walletInfo.walletID} />  
                  { <Button  className={classes.button} onClick={ ()=>{ delWalletAccount( row.accountName )}} >Delete</Button> }
                </TableCell>
              </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={ accounts.length }
            rowsPerPage={ rowsPerPage }
            page={ page }
            onPageChange={ handleChangePage }
            onRowsPerPageChange={ handleChangeRowsPerPage }
          />
      </Paper>
      </div>       
    </DialogContent>
    <DialogActions>
        { walletInfo.walletType !== "printer" && <div> <GenWalletAccount jwToken={ jwToken } walletID={ walletInfo.walletID } getWalletAccounts={ getWalletAccounts } /> </div>}
        <Button onClick={handleClose}>Close</Button>
    </DialogActions>
  </Dialog>
  </>

  );
}
