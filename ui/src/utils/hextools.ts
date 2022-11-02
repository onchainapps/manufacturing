export const hex2a = (hexx:string) => {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
};

export const a2hex = ( ascii: string ) => {
    var arr1 = [];
	for (var n = 0, l = ascii.length; n < l; n ++) 
     {
		var hex = Number(ascii.charCodeAt(n)).toString(16);
		arr1.push(hex);
	 }
	return arr1.join('');
};