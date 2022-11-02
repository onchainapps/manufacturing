import React, { useState } from 'react';
import { Button, TextField } from "@material-ui/core"; //tslint:disable-line
import { SpacePrinterAPI } from "../../api/SpacePrinterApis";

export const CheckShipping: React.FC = () => {

    const [ shipInfo, setShipInfo ] = useState({
        from_country_code: "US",
        from_postal_code: "78756",
        to_country_code: "US",
        to_postal_code: "91521",
        weightUnit: "pound",
        weightValue: "17"
    });

    const [ shippingResults, setShippingResults ] = useState();


    const estimateShipping = async () => {
        const jwtoken: any = sessionStorage.getItem("jwtoken");
        const userName: any = sessionStorage.getItem("userName");
        const shipengineAPI: any = "TEST_Oy0BOGXDF0O0gyUrl/bzqTfUBCuw90YIyozzW5rUDUM";
        const carrierIDs: any = ['se-963358'];

        console.log("carrier ids",  carrierIDs)
        try{
            const estimateSHippingRes: any = await SpacePrinterAPI.estimateShipping( jwtoken, userName, shipengineAPI, carrierIDs, shipInfo.from_country_code, shipInfo.from_postal_code, shipInfo.to_country_code, shipInfo.to_postal_code, shipInfo.weightUnit, shipInfo.weightValue );
            console.log("Shipping Estimate", estimateSHippingRes);
        }catch(error){
            console.log("estimate Ship Error", error);
        };
    };

    const updateShipInfo = async ( event: any ) => {

    };

    return (
        <>
            <div>
                <TextField
                    variant="outlined"
                    margin="dense"
                    required
                    id="from_country_code"
                    name="from_country_code"
                    label="From Country Code"
                    value={shipInfo.from_country_code}
                    onChange={(event:any) => {updateShipInfo(event.target.value)}}
                />
                <TextField
                    variant="outlined"
                    margin="dense"
                    required
                    id="from_postal_code"
                    name="from_postal_code"
                    label="From Country Code"
                    value={shipInfo.from_postal_code}
                    onChange={(event:any) => {updateShipInfo(event.target.value)}}
                />
            </div>
            <div>
                <TextField
                    variant="outlined"
                    margin="dense"
                    required
                    id="to_country_code"
                    name="to_country_code"
                    label="to Country Code"
                    value={shipInfo.to_country_code}
                    onChange={(event:any) => {updateShipInfo(event.target.value)}}
                />
                <TextField
                    variant="outlined"
                    margin="dense"
                    required
                    id="to_postal_code"
                    name="to_postal_code"
                    label="to_postal_code"
                    value={shipInfo.to_postal_code}
                    onChange={(event:any) => {updateShipInfo(event.target.value)}}
                />
            </div>
            <div>
                <TextField
                    variant="outlined"
                    margin="dense"
                    required
                    id="weightUnit"
                    name="weightUnit"
                    label="Weight Unit"
                    value={shipInfo.weightUnit}
                    onChange={(event:any) => {updateShipInfo(event.target.value)}}
                />
                <TextField
                    variant="outlined"
                    margin="dense"
                    required
                    id="weightValue"
                    name="weightValue"
                    label="Weight Value"
                    value={shipInfo.weightValue}
                    onChange={(event:any) => {updateShipInfo(event.target.value)}}
                />
            </div>

            <Button onClick={()=>estimateShipping()}>Estimate Shipping</Button>
            {
                shippingResults &&
                <>
                    <div>
                        Shipping Info and Options
                    </div>
                    <div>

                    </div>
                </>
            }
        </>
    )
}