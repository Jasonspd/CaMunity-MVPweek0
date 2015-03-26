var jade = require('jade');
var Joi = require('joi');
var Bell = require('bell');
var mongojs = require('mongojs');
var creds = require('../creds.json');
var db = require('./database.js');
var stripe = require("stripe")(creds.stripe_testsecret);
var token_uri = 'https://connect.stripe.com/oauth/token';
var qs = require('querystring');
var req = require('request');

//Exporting to server.js
module.exports = [

    {
        method: 'GET',
        path: '/public/css/{filename}',
        config: {auth: {mode: 'optional'}},
            handler: function(request, reply) {
                reply.file(__dirname + "/../public/css/" + request.params.filename);
            }
    },

    {
        method: 'GET',
        path: '/public/lib/{filename}',
        config: {auth: {mode: 'optional'}},
            handler: function(request, reply) {
                reply.file(__dirname + "/../public/lib/" + request.params.filename);
            }
    },

    {
        method: 'GET',
        path: '/stripe',
        config: {
            auth: 'camunity-cookie',
            handler: function (request, reply) {
                reply.view('homepage');
            }
        }
    },

//Homepage
    {
        method: 'GET',
        path: '/',
        config: {auth: {mode: 'optional'},
            handler: function(request, reply) {
                reply.view('homepage', {key: creds.stripe_testpk });
            }
        }
    },

//User profile page
    {
        method: 'GET',
        path: '/profile',
        config: {
            auth: 'camunity-cookie',
            handler: function(request, reply) {
                var d = request.auth.credentials;
                var dname = d.displayname;
                var first = d.firstname;
                var last = d.lastname;
                var email = d.email;
                var link = d.link;
                var picture = d.picture;
                reply.view('profile', {dname: dname, first: first, last: last, email: email, link: link, picture: picture});
            }
        }
    },

//User account page
    {
        method: 'GET',
        path: '/account',   
        config: {
            auth: 'camunity-cookie',
            handler: function(request, reply) {
                reply.view('account');
            }
        }
    },

//User can edit their account details
    {
        method: 'POST',
        path: '/account',
        config: {
            auth: 'camunity-cookie',
            handler: function(request, reply) {
                    var title = request.payload.title;
                    var summary = request.payload.summary;
                    var price = request.payload.price;
                    var client = request.auth.credentials.displayname;

                    db.addJob(title, summary, price, client, function(err, data) {
                        reply.redirect('/jobs');
                    });
            }
        }
    },


    {
        method: 'GET',
        path: '/login',
        config: {
            auth: 'google',
            handler: function (request, reply) {
                var g = request.auth.credentials.profile;
                var profile = {
                    id: g.id,
                    username: g.username,
                    displayname: g.displayName,
                    firstname: g.name.first,
                    lastname: g.name.last,
                    email: g.email,
                    link: g.raw.link,
                    picture: g.raw.picture,
                    gender: g.raw.male
                };
                request.auth.session.set(profile);
                db.addDetails(profile.id, profile.username, profile.displayname, profile.firstname, profile.lastname, profile.email, profile.link, profile.picture, profile.gender,
                function(err, data) {
                    reply.redirect('/profile');
                })
            }
        }    
    },

    {
        method: 'GET',
        path: '/jobs/{id}',
        config: {
            auth: 'camunity-cookie',
            handler: function(request, reply) {
                db.getAllJobs(function(err, data) {
                    var id = mongojs.ObjectId(request.params.id);
                    db.getOneJob(id, function(err2, job){
                        reply.view('eachjob', {jobs: data, thisJob: job} );
                    })
                });
            }
        }
    },

//Page to view all job posts
    {
        method: 'GET',
        path: '/jobs',
        config: {
            auth: 'camunity-cookie',
            handler: function(request, reply) {
                db.getAllJobs(function (err, data) {
                    reply.view('jobs', {jobs: data} );
                });
            }
        }
    },

//Directs user to stripe login page
    {
        method: 'GET',
        path: '/authorize',
        config: {auth: {mode: 'optional'},
            handler: function(request, reply) {
                var auth_uri = 'https://connect.stripe.com/oauth/authorize';
                reply.redirect(auth_uri + "?" + qs.stringify({
                    response_type: "code",
                    scope: "read_write",
                    client_id: creds.stripe_clientId
                }));
            }
        }
    },

//Callback route after users stripe account is created/logged in
//Uses access token to POST to stripe API, then retrieve users stripe account details
    {
        method: 'GET',
        path: '/oauth',
        config: {auth: {mode: 'optional'},
            handler: function(request, reply){
                var code = request.query.code;
                req.post({
                    url: token_uri,
                    form: {
                        grant_type: 'authorization_code',
                        client_id: creds.stripe_clientId,
                        code: code,
                        client_secret: creds.stripe_testsecret
                    }
                }, function(err, r, body) {
                    var userdetails = JSON.parse(body);
                    reply(body);
                });
            }
        }
    },

//Status page allowing client to enter credit card details and complete payment
{
    method: 'GET',
    path: '/status',
    config: {
        auth: 'camunity-cookie',
        handler: function(request, reply) {
            reply.view('status', {key: creds.stripe_testpk});
        }
    }
},

{
    method: 'POST',
    path: '/status',
    config: {
        auth: 'camunity-cookie',
        handler: function(request, reply) {
            var stripeToken = request.payload.stripeToken;
            db.addToken(stripeToken, function(err, data) {
                reply('Your details have been saved. Payment is only charged when the job is completed');
            });
        }
    }
},

{
    method: 'POST',
    path: '/jobcompleted',
    config: {
        auth: 'camunity-cookie',
        handler: function(request, reply) {
            db.getToken(function(err, data) {

            var charge = stripe.charges.create({
                amount:10000,
                currency:"gbp",
                source: data.stripetoken,
                destination: "acct_15juWJIQ7u0M1Wf0"
            }, function(err, charge) {
                if (err && err.type === 'StripeCardError') {
                    console.log("stripe error");
                }
            reply('Job completed')
            });

            });
        }
    }
},

//webhooks
// {
//     method: 'POST',
//     path: '/my/mywebhook/url',
//     config: {
//         handler: function(request, reply) {
//             var event_json = JSON.parse(request.payload);
//             console.log("An event has happened: " + event_json);
//             reply(200);
//         }
//     }
// },

// {
//     method: 'GET',
//     path: '/my/mywebhook/url',
//     config: {
//         handler: function(request, reply) {
//             console.log("something has happened");
//             reply(200);
//         }
//     }
// },


];