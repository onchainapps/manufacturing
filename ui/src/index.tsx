import ReactDOM from "react-dom";
import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import MainPage     from "./containers/MainPage/MainPage";
import LoadingPage  from "./containers/LoadingPage/LoadingPage";
import CreateUserPage from "./containers/CreateUserPage/CreateUserPage";
import LoginPage    from "./containers/LoginPage/LoginPage";
import PrinterPage  from "./containers/SpacePrinterPage/PrinterPage";
import SlicerPage   from "./containers/SlicerPage/SlicerPage";
import CardanoBoxWalletPage from "./containers/CardanoBoxWalletPage/CardanoBoxWalletPage";
import AdosiaMarketPlacePage from "./containers/AdosiaMarketPlacePage/AdosiaMarketPlacePage";
import ShippingPage from "./containers/ShippingPage/ShippingPage";
import PrinterWalletSetupPage from  "./containers/PrinterWalletSetupPage/PrinterWalletSetupPage";

const jwtoken = sessionStorage.getItem( 'jwtoken');

const routing = (
  <BrowserRouter>
    <Switch>
      <Route exact path="/">
          { jwtoken ? <MainPage /> : <LoadingPage />}
      </Route>
      <Route path="/LoadingPage">
        <LoadingPage />  
      </Route> 
      <Route path="/CreateUserPage">
        <CreateUserPage />  
      </Route> 
      <Route path="/LoginPage">
        <LoginPage />  
      </Route> 
      <Route path="/MainPage">
        <MainPage />  
      </Route>
      <Route path="/PrinterPage">
        <PrinterPage />  
      </Route>
      <Route path="/SlicerPage">
        <SlicerPage />
      </Route>
      <Route path="/CBWalletPage">
        <CardanoBoxWalletPage />
      </Route>
      <Route path="/AdosiaMarketPlacePage">
        <AdosiaMarketPlacePage />
      </Route>
      <Route path="/ShippingPage">
        <ShippingPage />
      </Route>
      <Route path="/PrinterWalletSetupPage">
        <PrinterWalletSetupPage />
      </Route>
    </Switch>
  </BrowserRouter>
);

ReactDOM.render(
  routing, document.getElementById("root")
);
  