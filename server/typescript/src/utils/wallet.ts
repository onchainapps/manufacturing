import { mnemonicToEntropy, generateMnemonic, validateMnemonic } from 'bip39';
import CardanoWasm = require('@emurgo/cardano-serialization-lib-nodejs')

const harden = (num: number): number => {
  return 0x80000000 + num;
};

export const genSeedPhrase = async () => {
  try{
    const mnemonic: any = await generateMnemonic(256);
    // console.log("new mnemonic: " + mnemonic);
    return( mnemonic );
  }catch( error ){
    console.error( error );
    return( error );
  };  
};
  
export const validateSeedPhrase = async (seed: any) => {
  try{
    const validate: any = await validateMnemonic(seed);
    return(validate);
  }catch(error){
    console.log(error);
    return ( error );
  };
};
  
export const entropyToRoot = async ( entropy: any ) => {
  try{
    return await CardanoWasm.Bip32PrivateKey.from_bip39_entropy(
      Buffer.from(entropy, 'hex'),
      Buffer.from(''),
    );
  }catch( error ){
      console.log(error)
      return(error);
  };
};

export const genAccountKeyPrv = async (rootKey: any, purpose: number, coinType: number, accIndex: number ) => {
  purpose: number = 1852;
  coinType: number = 1815;
  try{
    return await rootKey
      .derive(harden(purpose))   // purpose
      .derive(harden(coinType))  // coin_type
      .derive(harden(accIndex)); // account #0
  }catch( error ){
    console.log(error);
    return(error);
  };
};

export const genAccountKeyPub = async ( accountKeyPrv: any ) => {
  try{
    const accountKeyPub = await accountKeyPrv.to_public();
    return(accountKeyPub);
  }catch( error ){
    console.log( error );
    return( error );
  };
};

export const genUTXOKey = async ( accountKeyPrv: any, index?: number ) => {
  try{
    const utxoKey = accountKeyPrv
      .derive(0) // 0 external || 1 change || 2 stake key
      .derive(index) // index
    return(utxoKey);    
  }catch(error){
    console.log(error);
    return(error);
  }
};

export const genChangeKey = async ( accountKeyPrv: any, index?: number ) => {
  try{
    const stakeKey = accountKeyPrv
      .derive(1) // 0 external || 1 change || 2 stake key
      .derive(index) // index
    return(stakeKey);
  }catch(error){
    console.log(error);
    return(error);
  };
};

export const genStakeKey = async ( accountKeyPrv: any, index?: number ) => {
  try{
    const stakeKey = accountKeyPrv
      .derive(2) // 0 external || 1 change || 2 stake key
      .derive(index) // index
    return(stakeKey);
  }catch(error){
    console.log(error);
    return(error);
  };
};

// base address with staking key
export const genBaseAddr = async ( network: number, utxoPubKey: any, stakeKey: any ) => {
  try{
    const baseAddr = CardanoWasm.BaseAddress.new(
      network, // 0 testnet || 1 mainnet
      CardanoWasm.StakeCredential.from_keyhash(utxoPubKey.to_raw_key().hash()),
      CardanoWasm.StakeCredential.from_keyhash(stakeKey.to_raw_key().hash()),
    );
    return( baseAddr );
  }catch( error ){ 
    console.log( error );
    return( error );
  };
};

// enterprise address without staking ability, for use by exchanges/etc
export const genEnterpriseAddr = async ( network: number, utxoPubKey: any ) => {
  try{
    const enterpriseAddr = CardanoWasm.EnterpriseAddress.new(
      network, // 0 testnet || 1 mainnet
      CardanoWasm.StakeCredential.from_keyhash(utxoPubKey.to_raw_key().hash())
    );
    return(enterpriseAddr);
  }catch( error ){
    console.log( error )
    return( error );
  }  
};

// pointer address - similar to Base address but can be shorter, see formal spec for explanation
export const genPointerAddr = async ( network: number, utxoPubKey: any ) => {
  try{
    const ptrAddr = CardanoWasm.PointerAddress.new(
      network, // 0 testnet || 1 mainnet
      CardanoWasm.StakeCredential.from_keyhash(utxoPubKey.to_raw_key().hash()),
      CardanoWasm.Pointer.new(
        100, // slot
        2,   // tx index in slot
        0    // cert indiex in tx
      )
    );
    return( ptrAddr );
  }catch( error ){
    console.log( error );
    return( error );
  };
};

// reward address - used for withdrawing accumulated staking rewards
export const genRewardAddr = async ( network: number, stakeKey: any ) => {
  try{
    const rewardAddr = CardanoWasm.RewardAddress.new(
      network, // 0 testnet || 1 mainnet
      CardanoWasm.StakeCredential.from_keyhash(stakeKey.to_raw_key().hash())
    );
    return( rewardAddr );
  }catch( error ){
    console.log( error );
    return( error );
  };
};

// bootstrap address - byron-era addresses with no staking rights
export const genByronAddr = async ( network: number, utxoPubKey: any ) => {
  try{
    const byronAddr = CardanoWasm.ByronAddress.icarus_from_key(
      utxoPubKey, // Ae2* style icarus address
      network, // 0 testnet || 1 mainnet
    );
    return( byronAddr );
  }catch( error ){
    console.log( error );
    return( error );
  };
};
