import { EstimateShipping } from "../generated-typings";
const exec = require('child_process').execSync;
import { checkJWT } from "../utils/checkauth";

const estimateShipping: EstimateShipping = (jwToken, userName, shipengineAPI, carrierIDs, fromCountryCode, fromPostalCode, toCountryCode, toPostalCode, weightUnits, weightAmount) => {
  return new Promise( async (resolve, reject) => {
    const checkToken: any = await checkJWT(jwToken, userName);
    if( checkToken.name ) return resolve("authError");

    const estimateShippingRes: any = getShippingEstimate(shipengineAPI, carrierIDs, fromCountryCode, fromPostalCode, toCountryCode, toPostalCode, weightUnits, weightAmount);
    return resolve(estimateShippingRes);

  });
};

const getShippingEstimate: any = async (shipengineAPI: string, carrierIDs: string, fromCountryCode: string, fromPostalCode: string, toCountryCode: string, toPostalCode: string, weightUnits: string, weightAmount: string) => {
  return new Promise( async (resolve) => {
    try{
      let carrier: string = "se-157590"
      const getShippingEstimateCMD: any = `curl 'https://api.shipengine.com/v1/rates/estimate' \
      -X POST -H "API-Key: ${shipengineAPI}" \
      -H "Content-Type: application/json" \
      --data-raw '{
          "carrier_ids": [ "se-157590" ],
          "from_country_code":"${fromCountryCode}",
          "from_postal_code":"${fromPostalCode}",
          "to_country_code":"${toCountryCode}",
          "to_postal_code":"${toPostalCode}",
          "weight":{
            "value": "${weightAmount}",
            "unit": "${weightUnits}"
          }
        }'`
        const getShippingEstimateRes: any = await exec( getShippingEstimateCMD , { "encoding":"utf8" } )
        console.log(getShippingEstimateRes);
        resolve(getShippingEstimateRes)      
    }catch(error){
      console.log("estimateShippingError", error)
      return("error");
    }
  });
};

export default estimateShipping;

