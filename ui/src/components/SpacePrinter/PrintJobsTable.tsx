import React from 'react';
import { makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, FormControlLabel, Checkbox, TextField, Button } from '@material-ui/core/'; //tslint:disable-line
import { a2hex, hex2a } from "../../utils/hextools";
import { STLDialog } from "./STLDialog";
import { MakeOfferPopup } from "./MakeOfferPopup";
type AccountAssetsTableProps = {
  rows: any,

}
export const PrintJobsTable: React.FC<AccountAssetsTableProps> = ({ rows }) => {
  const useStyles = makeStyles({
    root: {
      width: '100%',
    },
    container: {
      minHeight: 600,
    }
  });

  const columns: any[] = [
    { id: "asset", label: 'Asset Name', width: 50, disablePadding: false, },
    { id: "Offer", label: 'Offer', width: 50, disablePadding: false, },
    { id: "media", label: "media", width: 50, disablePadding: false, },
    { id: "makeOffer", label: "", width: 50, disablePadding: false, },
  ];

  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [ ipfsGateway, setIPFSGateway ] = React.useState("https://ipfs.bakon.dev")
  const [ viewMedia, setViewMedia ] = React.useState(false);
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const toggleViewMedia = () => {
    viewMedia === false ? setViewMedia(true) : setViewMedia(false);
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table" size="small">
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
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: any) => {      
              row.asset && console.log(row);        
              return(
              row.asset && hex2a(row.meta.asset_name) === "spacecoinsRocket" &&
              <TableRow hover role="checkbox" tabIndex={-1} key={row.asset} style={{ height: 120 }} >
                <TableCell component="th" scope="row" style={{  minHeight: 100,  width: 50 }}>
                  {
                    typeof row !== "number" && 
                    <>{hex2a(row.meta.asset_name)}<br/><br/><hr/>Description:<br/>This really cool rocket from this really cool team.</>

                  }
                </TableCell>
                <TableCell align="left" style={{  minHeight: 50,  width: 50 }}>
                  
                </TableCell>
                <TableCell align="left" style={{  minHeight: 100, width: 50 }}>
                  <div>
                    <img src={ `${ipfsGateway}/ipfs/${row.meta.onchain_metadata.image.replace("ipfs://","")}` } width="140" />
                  </div>
                  <div style={{margin: "0 Auto" }}>
                    <Button onClick={()=>toggleViewMedia()}>View Files</Button>
                  </div>
                  {viewMedia === true && 
                  <div>
                  { row.meta.onchain_metadata && row.meta.onchain_metadata.files && row.meta.onchain_metadata.files.length > 0 &&
                    row.meta.onchain_metadata.files.map( (file: any, key: any) => {
                      return(
                        <>
                          { 
                            file.mediaType == "model/stl" &&
                            <STLDialog 
                              fileUrl={`${ipfsGateway}/ipfs/${file.src.replace("ipfs://","")}` } 
                              fileName={hex2a(row.meta.asset_name)} 
                              stlName={file.name ? file.name : hex2a(row.meta.asset_name)} 
                              color={file.color ? file.color : "green"} 
                              type="stl" />
                          }
                          { 
                            file.mediaType == "model/gltf-binary" && 
                            <STLDialog 
                              fileUrl={`${ipfsGateway}/ipfs/${file.src.replace("ipfs://","")}` } 
                              fileName={hex2a(row.meta.asset_name)} 
                              stlName={file.name ? file.name : ""} 
                              type="gbl" 
                              color="" 
                              />  
                            }<br/>
                          { /* file.mediaType == "model/stl" && <STLDialog fileUrl={`${ipfsGateway}/ipfs/${file.src.replace("ipfs://","")}` } fileName={hex2a(row.meta.asset_name)} /> */ }
                        </>
                      )
                    })
                  }
                  </div>
                  }
                </TableCell>
                <TableCell align="left" style={{  minHeight: 100, width: 50 }}>
                  <MakeOfferPopup />
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
