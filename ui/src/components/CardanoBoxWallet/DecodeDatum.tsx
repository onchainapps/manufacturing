import React, { useState, useEffect } from 'react';
import { Tooltip, Button } from '@material-ui/core/';

type DecodeDatumProps = {
  datum: any,
}

export const DecodeDatum = ( {datum}: DecodeDatumProps ) => {

  const blockfrostApi: any = localStorage.getItem("blockfrostApi");
  const [ datumRes, setDatumRes ]: any = useState();

  const getDatum = async () => {
    const settings = {
      method: 'GET',
      headers: {
        'project_id': blockfrostApi
      }
    };

    const fetchResponse: any = await fetch(`https://cardano-testnet.blockfrost.io/api/v0/scripts/datum/${datum}`, settings);
    const data: any = await fetchResponse.json();
    setDatumRes(data);
  }

  useEffect(
    ( ) => {
      getDatum();
    }, []);

  return(
    <>
      {datumRes && console.log(datumRes)}
      {
        datumRes && datumRes.error ? 
         datum 
        :

          <Button>
            { datum }
          </Button>

        
      }
    </>
  )
};