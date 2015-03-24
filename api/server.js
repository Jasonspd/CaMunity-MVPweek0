var Hapi = require('hapi');
var server = new Hapi.Server();
var Path = require('path');
var Joi = require('joi');
var Bell = require('bell');
var AuthCookie = require('hapi-auth-cookie');
var routes = require('./routes.js');
var creds = require('../creds.json');

/* $lab:coverage:off$ */
server.connection({
    host: 'localhost',
    port: process.env.PORT || 9000
});
/* $lab:coverage:on$ */

server.views({
        engines: {
            jade: require('jade')
        },
        path: Path.join(__dirname, '../views')
    });

server.route(routes);





//TWITTER AUTH

// server.register([Bell, AuthCookie], function (err) {
//     if (err) {
//         console.error(err);
//         return process.exit(1);
//     }

//     var authCookieOptions = {
//         password: 'cookie-encryption-password',
//         cookie: 'camunity-auth',
//         isSecure: false
//     };
//     server.auth.strategy('camunity-cookie', 'cookie', authCookieOptions);
    
//     var bellAuthOptions = {
//         provider: 'twitter',
//         password: 'twitter-encryption-password',
//         clientId: creds.twitter_clientId,
//         clientSecret: creds.twitter_clientSecret,
//         isSecure: false
//     };
//     server.auth.strategy('twitter-oauth', 'bell', bellAuthOptions);

//     server.auth.default('camunity-cookie');

//     server.route(routes);
// });


module.exports = server;