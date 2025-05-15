const crypto = require('crypto');
const base64url = require('base64url');

const url_shortner = (url) => {
    const hash = crypto.createHash('md5');
    hash.update(url);
    const digest = hash.digest('base64');
    return base64url(digest);
}


module.exports = {
    url_shortner
}
