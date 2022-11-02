const crypto = require('crypto');
const IV_LENGTH = 16;
const algorithm = 'aes-256-ctr';

export const encrypt = ( passPhrase: string, text: string ) => {
    const hardenedPass: any = Buffer.concat([Buffer.from(passPhrase), Buffer.alloc(32)], 32);
    try{
        let iv = crypto.randomBytes(IV_LENGTH);
        let cipher = crypto.createCipheriv(algorithm, Buffer.from(hardenedPass, 'hex'), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    }catch(error){
        console.log(error);
        return(error);
    };
};

export const decrypt = ( passPhrase: string, text: string ) => {
    const hardenedPass: any = Buffer.concat([Buffer.from(passPhrase), Buffer.alloc(32)], 32);
    try{
        let textParts: any = text.split(':');
        let iv = Buffer.from(textParts.shift(), 'hex');
        let encryptedText = Buffer.from(textParts.join(':'), 'hex');
        let decipher = crypto.createDecipheriv(algorithm, Buffer.from(hardenedPass, 'hex'), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }catch( error ){
        console.log( error );
        return( error );
    };
};