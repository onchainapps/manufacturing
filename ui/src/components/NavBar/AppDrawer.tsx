import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {  Drawer, Button, Divider } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
  list: {
    width: 250,
    height: 150
  },
  fullList: {
    width: 'auto',
  },
});

type Anchor = 'top' | 'left' | 'bottom' | 'right';

const AppDrawer: React.FC = () => {
  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  }); 
  const history = useHistory();
  const toggleDrawer = (anchor: Anchor, open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor: Anchor) => (
    <div className={clsx(classes.list, { [classes.fullList]: anchor === 'top' || anchor === 'bottom', })} role="presentation" onClick={toggleDrawer(anchor, false)} onKeyDown={toggleDrawer(anchor, false)} >
      <Button onClick={()=>history.push("/CBWalletPage")} >Printer Wallet</Button>
      <div>
      <Button onClick={()=>history.push("/PrinterPage")} >Space Printer</Button>
      <Button onClick={()=>history.push("/SlicerPage")} >Slicer</Button>
      </div>
      <Divider />
    </div>
  );
  return (
    <>
      {(['bottom'] as Anchor[]).map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>apps</Button>
          <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </>
  );
}

export default AppDrawer;
