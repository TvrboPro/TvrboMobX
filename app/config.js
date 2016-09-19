"use strict";

var nconf = require( 'nconf' );

nconf.env();

// 'MYAPP_' is prefixing every variable to prevent collisions in the server's
// environment variables

// To get the value of MYAPP_DEBUG, simply use it as config.DEBUG
// (skip the prefix)

var defaults = {

    // GENERIC
    MYAPP_DEBUG: process.env.NODE_ENV != "production",  // false means production

    MYAPP_APP_NAME: 'TVRBO REACT MOBX',
    MYAPP_HTML_TITLE: 'TVRBO REACT MOBX',
    MYAPP_DOMAIN: 'yourdomain.com',  // without 'www'
    MYAPP_SERVER_URL: 'http://www.yourdomain.com',

    MYAPP_HTTP_PORT: process.env.PORT || (process.env.NODE_ENV != 'production' ? 3000 : 8080),
    MYAPP_ALLOW_CORS: false,

    // DATABASE
    MONGODB_URI: '', // Leave blank if not used
    // MONGODB_URI: 'mongodb://localhost:27017/twins',

    // RESTRICT ACCESS
    MYAPP_HTTP_USER: '',
    MYAPP_HTTP_PASSWORD: ''
};

nconf.defaults(defaults);

var k;
for(k in defaults) {
    if(defaults.hasOwnProperty(k)) {
        exports[k.replace(/^MYAPP_/, "")] = nconf.get(k); // REMOVING THE VARIABLE'S PREFIX MYAPP_
    }
}
