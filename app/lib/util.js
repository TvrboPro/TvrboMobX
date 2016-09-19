var crypto = require('crypto');

export function digestPwd(pwd){
	var shasum = crypto.createHash('sha1');
	shasum.update(pwd);
	return shasum.digest('hex');
}
