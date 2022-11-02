import React, { useState, useEffect } from 'react';
import { makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, FormControlLabel, Checkbox } from '@material-ui/core/'; //tslint:disable-line
import { DecodeDatum } from "./DecodeDatum";

type AccountUTXOsTableProps = {
  rows: any,
  utxos: any,
  setUtxos: any,
  outputs: any, 
  setOutputs: any,
  utxoCheck: any,
  setUtxocheck: any,
  assetCheck: any,
  setAssetcheck: any,
}

export const AccountUTXOsTable: React.FC<AccountUTXOsTableProps> = ({ rows, utxos, setUtxos, outputs, setOutputs, utxoCheck, setUtxocheck, assetCheck, setAssetcheck }) => {
  const useStyles = makeStyles({
    root: {
      width: '100%',
    },
    container: {
      maxHeight: 600,
    },
  });
  const columns: any[] = [
    { id: "TxIx", label: 'UTXO', minWidth: 70 },
    { id: "TXIndex", label: 'INDEX',  minWidth: 50 },
    { id: "assets", label: 'Assets',  minWidth: 50 },
    { id: "datum", label: 'Datum',  minWidth: 50 },
    { id: "lovelace", label: 'Lovelace',  minWidth: 50 },
    { id: "lovelaceSum", label: 'Total Lovelace',  minWidth: 50 },
  ];

  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSelected = async (event: React.ChangeEvent<HTMLInputElement>,  TxId: string, txIndex:any, inputValue: any, assets: any ) => {
    setUtxocheck({ ...utxoCheck, [event.target.name]: event.target.checked });

    if( event.target.checked == false ){
      setUtxos(utxos.filter(( utxo: any ) => utxo.id !== TxId+txIndex ));
      utxos.length == 0 && setOutputs([]);
      await Object.entries(assets).map( async ( asset: any )=> {
        console.log(asset)
        outputs = outputs.filter((output: any ) => output.outputAsset !== asset[0]+"."+TxId+txIndex );
        setOutputs(outputs);

        assetCheck = { ...assetCheck, [asset[0]+"."+TxId+txIndex]: event.target.checked };
        setAssetcheck(assetCheck);
        console.log(asset[0]+"."+TxId+txIndex);
      });
      console.log(utxos);
      console.log(assetCheck);
      console.log(outputs);
    };
    
    if ( event.target.checked == true ){
      if (utxos.length > 0 ){
        let exists = 0;
        await utxos.map((utxo: any) => {
          if( TxId == utxo.txix && txIndex == utxo.txIndex ){
            exists = 1;
          }
        })
        exists == 0 && setUtxos( [ ...utxos, {
                                              id: TxId+txIndex,
                                              txix: TxId,
                                              txIndex, 
                                              inputValue: inputValue.toString(), 
                                              assets 
                                            }])
      }else{
        console.log("setting new UTXO")
        setUtxos( [ ...utxos, { 
                                id: TxId+txIndex,
                                txix:TxId, 
                                txIndex, 
                                inputValue: inputValue.toString(), 
                                assets 
                              }])
      }
    };
  };
  
  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table 
          stickyHeader 
          aria-label="sticky table" 
          size="small"
        >
          <TableHead>
            <TableRow>
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
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(  (row: any) => {
              // {!row.asset && console.log(row)}
              return(
              !row.asset &&
              <TableRow hover role="checkbox" tabIndex={-1} key={row.TxId+row.txIndex} >
                <TableCell>
                  {
                    typeof row !== "number" && 
                    <FormControlLabel
                      control={
                      <Checkbox 
                        checked={utxoCheck[row.TxId+"#"+row.txIndex]} 
                        onChange={ (event: any) => { handleSelected(event, row.TxId, row.txIndex, row.loveLace, row.assets  ); } } 
                        name={row.TxId+"#"+row.txIndex} 
                      />
                       
                      }
                      label={row.TxId}
                    />    
                  }
                </TableCell>
                <TableCell>
                  { row.txIndex }
                </TableCell>

                <TableCell>
                  { row.assets && (Object.entries(row.assets).length) }
                </TableCell>

                <TableCell>
                  {  row.datum && row.datum }
                </TableCell>

                <TableCell>
                  { row.loveLace }
                </TableCell>

                <TableCell>
                  { typeof row === "number" && row }
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
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
