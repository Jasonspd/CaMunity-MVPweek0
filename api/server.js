var Hapi = require('hapi');
var server = new Hapi.Server();
var Path = require('path');
var Joi = require('joi');
var Bell = require('bell');
var Boom = require('boom');
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




// GOOGLE AUTHNENTICATION ATTEMPT
server.register([Bell, AuthCookie], function(err) {
	if (err) {
		console.error(err);
		return process.exit(1);
	}
	var authCookieOptions = {
		password: 'cookie-password',
		cookie: 'camunity-auth',
		isSecure: false
	};
	server.auth.strategy('camunity-cookie', 'cookie', authCookieOptions);

	var bellAuthOptions = {
		provider: 'google',
		password: 'google-encryption-password',
		clientId: creds.google_clientId,
		clientSecret: creds.google_clientSecret,
		isSecure: false,
		providerParams: {
			redirectUri : 'http://localhost:9000/login'
		} 
	};

server.auth.strategy('google', 'bell', bellAuthOptions);

server.auth.default('camunity-cookie');

// server.route({
// 	method: 'GET',
// 	   path: '/login',
// 	   config: {
// 	       auth: 'google',
// 	       handler: function (request, reply) {
// 	           var g = request.auth.credentials;
//   	     			var profile = {
// 	          		name: g.profile.displayName,
//   	          		email: g.profile.email,
//   	          		picture: g.profile.raw.picture,
//   	      		};
// 	 	           // if (true) {
// 	 	               // request.auth.session.clear();
// 	 	           request.auth.session.set(profile);
// 	 	           return reply.redirect('/');
// 	 	           // }
// 	 	           // else {
// 	 	           // 	reply('Not logged in...');    
// 	 	           // }
// 	 	       }
// 	 	   }
// 	});    
server.route(routes);

});

module.exports = server;