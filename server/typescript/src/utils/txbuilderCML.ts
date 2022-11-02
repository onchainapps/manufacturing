/*
import CardanoWasm = require("@dcspark/cardano-multiplatform-lib-nodejs");

export const gruntTX = async ( utxoKey: any, utxos: string, assets:string, metadata: string, outputs: any, changeAddress: string, txTTL: number ) => {
  let includeMeta = 0;

  try{
    // instantiate the tx builder with the Cardano protocol parameters - these may change later on
    const txBuilder: any = await CardanoWasm.TransactionBuilder.new(
      CardanoWasm.TransactionBuilderConfigBuilder.new()
        .fee_algo( CardanoWasm.LinearFee.new(CardanoWasm.BigNum.from_str('44'),CardanoWasm.BigNum.from_str('155381')))
        .pool_deposit(CardanoWasm.BigNum.from_str('500000000'),)
        .key_deposit( CardanoWasm.BigNum.from_str('2000000'),)
        .coins_per_utxo_word(CardanoWasm.BigNum.from_str('34482'))
        .max_value_size(5000)
        .max_tx_size(16384)
        .build()
    );
    
    // Set all provided UTXOs as inputs and their values and indexes
    if ( JSON.parse(utxos).length > 0 ){
      console.log("adding UTXOs");
      await JSON.parse(utxos).map( async( utxo: any ) => {
        // set utxo input map the array 
        console.log("Adding utxo: " + utxo.txix)
        await txBuilder.add_input(
          CardanoWasm.Address.from_bech32(changeAddress),
          CardanoWasm.TransactionInput.new(
            CardanoWasm.TransactionHash.from_bytes(
                Buffer.from(utxo.txix, "hex")
            ), // tx hash
            utxo.txIndex, // index
          ),
          CardanoWasm.Value.new(CardanoWasm.BigNum.from_str(utxo.inputValue))
        );
      });
    };

    // parse UTXOs with assets and add them to the TX
    if ( JSON.parse( utxos ).length > 0 ){
      console.log( "Assets Inputs from UTXos" );
      await JSON.parse(utxos).map( async (utxo: any ) =>{
        if( Object.entries( utxo.assets).length > 0 ) {
          console.log( "Adding Assets" );
          await Object.entries( utxo.assets).map( async ( asset: any )=>{
            // console.log(asset);
            const assetsVal = CardanoWasm.Value.new( CardanoWasm.BigNum.from_str('0') );
            const assetMA = CardanoWasm.MultiAsset.new();
            const assetToAdd = CardanoWasm.Assets.new();
           
            const policyID: string = asset[0].split(".")[0];
            const assetName: string = asset[0].split(".")[1];
            const amount = CardanoWasm.BigNum.from_str(asset[1].toString());

            // Inserting Native token
            console.log("Adding Asset: " + assetName )
            await assetToAdd.insert(
              CardanoWasm.AssetName.new(Buffer.from(assetName, "hex")),
              amount
            );

            // Adding asset to multiasset
            console.log("Adding Asset Policy: " + policyID )
            await assetMA.insert(
              CardanoWasm.ScriptHash.from_bytes(Buffer.from(policyID, "hex")),
              assetToAdd
            );

            // Setting value with multiasset
            await assetsVal.set_multiasset(assetMA);
            
            // adding input for the asset with assetsValue set to 0.
            console.log("adding asset input: " + assetName)
            await txBuilder.add_input(
              CardanoWasm.Address.from_bech32( changeAddress ),
              CardanoWasm.TransactionInput.new(
                CardanoWasm.TransactionHash.from_bytes(
                    Buffer.from(utxo.txix, "hex")
                ), // tx hash
                utxo.txIndex, // index
              ),
              assetsVal
            );   
          });
        };
      });
    };

    await JSON.parse( outputs ).map ( async ( output: any ) => {
      let dataHash: any; 
      let hasDatum: any = 0;
      // console.log(output);
      if( !output.assetName ){

        if(output.datums.length > 0){
          console.log("adding Datums");          

          const fields = CardanoWasm.PlutusList.new();
          
          await output.datums.map(( datum: any ) => {
            console.log(datum);
          // fields.add(CardanoWasm.PlutusData.new_bytes(Buffer.from('3f7826896a48c593598465a096d63606ceb8206', 'hex|utf8')));
          // fields.add(CardanoWasm.PlutusData.new_integer(CardanoWasm.BigInt.from_str("22222")));             
            datum.datumType === "byte" && fields.add(CardanoWasm.PlutusData.new_bytes(Buffer.from( datum.datumValue, datum.byteType )));
            datum.datumType === "int" && fields.add(CardanoWasm.PlutusData.new_integer(CardanoWasm.BigInt.from_str( datum.datumValue )));
          });
        
  
          const constrDatum = CardanoWasm.ConstrPlutusData.new(
            CardanoWasm.BigNum.from_str(output.datums[0].constructorOuter),
            fields
          );
          
          const datum = CardanoWasm.PlutusData.new_constr_plutus_data(constrDatum);
          dataHash = CardanoWasm.hash_plutus_data(datum);
          hasDatum = 1;
          
        };
        hasDatum == 0 && console.log(`Sending: ${output.outputValue} lovelace to: ${output.outputAddress}`)
        hasDatum == 1 && console.log(`Sending: ${output.outputValue} lovelace to: ${output.outputAddress} AND Datum`)

        hasDatum == 0 ? 
        await txBuilder.add_output(
          CardanoWasm.TransactionOutputBuilder.new()
          .with_address( CardanoWasm.Address.from_bech32( output.outputAddress ) )
          .next()
          .with_value( CardanoWasm.Value.new( CardanoWasm.BigNum.from_str( output.outputValue )))
          .build()
        )
        :
        await txBuilder.add_output(
          CardanoWasm.TransactionOutputBuilder.new()
          .with_address( CardanoWasm.Address.from_bech32( output.outputAddress ) )
          .with_data_hash(dataHash)
          .next()
          .with_value( CardanoWasm.Value.new( CardanoWasm.BigNum.from_str( output.outputValue )))
          .build()
        )

      };
    });

    // output for asset transfer , Assets will use min required coin change will be calculated after all inputs are passed
    if ( JSON.parse( outputs ).length > 0 ){
      await JSON.parse( outputs ).map ( async ( output: any ) => {
        if( output.assetName ){
          const assetsVal = CardanoWasm.Value.new( CardanoWasm.BigNum.from_str( output.outputValue ) );
          const assetMA = CardanoWasm.MultiAsset.new();
          const assetToAdd = CardanoWasm.Assets.new();
          const amount = CardanoWasm.BigNum.from_str(output.assetAmount);

          // Inserting Native token
          console.log("Adding Asset: " + output.assetName )
          await assetToAdd.insert(
            CardanoWasm.AssetName.new(Buffer.from(output.assetName, "hex")),
            amount
          );
          // Adding asset to multiasset
          console.log("Adding Asset Policy: " + output.policyID )
          await assetMA.insert(
            CardanoWasm.ScriptHash.from_bytes(Buffer.from(output.policyID, "hex")),
            assetToAdd
          );
          // Setting value with multiasset
          await assetsVal.set_multiasset(assetMA);
          console.log("Adding asset output: " + output.assetName);
          await txBuilder.add_output(
            CardanoWasm.TransactionOutputBuilder.new()
            .with_address( CardanoWasm.Address.from_bech32( output.outputAddress ))
            .next()
            .with_asset_and_min_required_coin( assetMA, CardanoWasm.BigNum.from_str('34482'))
            .build()
          );
        };
      });
    };
    
    // METADATA
    if( JSON.parse(metadata).length > 0 ){
      // MetaData stuff
      console.log('adding meta');
      const generalTxMeta = CardanoWasm.GeneralTransactionMetadata.new()
      const auxData = CardanoWasm.AuxiliaryData.new();

      await JSON.parse(metadata).map( async( meta: any) => 
        await generalTxMeta.insert(
            CardanoWasm.BigNum.from_str( meta.label ),
            CardanoWasm.encode_json_str_to_metadatum(
              JSON.stringify(meta.metadata),
              0
            )
          )
      );
      await auxData.set_metadata(generalTxMeta);
      await txBuilder.set_auxiliary_data(auxData);
      includeMeta = 1;
    };

    // txBuilder.add_inputs_from(JSON.parse(utxos));

    // set the time to live - the absolute slot value before the tx becomes invalid
    console.log("setting ttl");
    await txBuilder.set_ttl(txTTL);

    // calculate the min fee required and send any change to an address
    console.log("setting change");
    await txBuilder.add_change_if_needed( CardanoWasm.Address.from_bech32(changeAddress) );

    // once the transaction is ready, we build it to get the tx body without witnesses
    console.log("Building and singing TX");
    const newTX = await txBuilder.build_tx();
    const txHash = await CardanoWasm.hash_transaction(newTX.body());

    // add keyhash witnesses
    const witnesses = await CardanoWasm.TransactionWitnessSet.new();
    const vkeyWitnesses = await CardanoWasm.Vkeywitnesses.new();
    const vkeyWitness = await CardanoWasm.make_vkey_witness(txHash, utxoKey.to_raw_key());
    await vkeyWitnesses.add(vkeyWitness);
    await witnesses.set_vkeys(vkeyWitnesses);

    // create the finalized transaction with witnesses
    const transaction = await CardanoWasm.Transaction.new(
      newTX.body(),
      witnesses,
      includeMeta == 1 ? newTX.auxiliary_data() : undefined, //metadata
    );

    const txHex = await Buffer.from(transaction.to_bytes()).toString("hex");
    const txBytes = await  Buffer.from(transaction.to_bytes());
    const fee: any = await txBuilder.get_fee_if_set().to_str();

    
    return(
      {
        cborHex: txHex,
        txBytes,
        fee
      }
    );
  }catch(error){
    console.log( error );
    return( error );
  };
};
*/