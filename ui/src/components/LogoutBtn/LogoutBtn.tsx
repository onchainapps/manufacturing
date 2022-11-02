import React from "react";
import { ButtonBase } from "@material-ui/core"; //tslint:disable-line
import { useHistory } from "react-router-dom";

const LogoutBtn: React.FC = () => {
  const history = useHistory();
  
  const logout = () => {
    sessionStorage.clear();
    history.push("/LoginPage")
  };

  return (
    <>
      <ButtonBase onClick={()=> window.location.assign(window.location.protocol + "//" + window.location.hostname + "/LoginPage")  } >Logout</ButtonBase>
    </>
  );
};



export default LogoutBtn;
