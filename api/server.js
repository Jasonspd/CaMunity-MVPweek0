var Hapi = require('hapi');
var server = new Hapi.Server();
var Path = require('path');
var Joi = require('joi');
var Bell = require('bell');
var AuthCookie = require('hapi-auth-cookie');
var routes = require('./routes.js');

/* $lab:coverage:off$ */
server.connection({
    host: 'localhost',
    port: process.env.PORT || 8080
});
/* $lab:coverage:on$ */

server.views({
        engines: {
            jade: require('jade')
        },
        path: Path.join(__dirname, '../views')
    });

server.route(routes);

// server.register([Bell, AuthCookie], function (err) {
    
//     if (err) {
//         console.error(err);
//         return process.exit(1);
//     }

//     var authCookieOptions = {
//         password: 'cookie-encryption-password',
//         cookie: 'twitter-auth',
//         isSecure: false
//     };

//     server.auth.strategy('twitter-cookie', 'cookie', authCookieOptions);
    
//     var bellAuthOptions = {
//         provider: 'twitter',
//         password: 'twitter-encryption-password',
//         clientId: creds.clientId,
//         clientSecret: creds.clientSecret,
//         isSecure: false
//     };

//     server.auth.strategy('twitter-oauth', 'bell', bellAuthOptions);

//     server.auth.default('camunity-cookie');

//     server.route(routes);
// });

module.exports = server;