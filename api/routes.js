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
            auth: 'google',
            handler: function (request, reply) {
                reply.view('homepage');
            }
        }
    },

//Homepage
    {
        method: 'GET',
        path: '/',
        config: {
            handler: function(request, reply) {
                if(request.auth.isAuthenticated) {
                    return reply.redirect('/profile');
                }
                else {
                    reply.view('homepage', {key: creds.stripe_testpk });
                }
            }
        }
    },

//User profile page
    {
        method: 'GET',
        path: '/profile',
        config: {
            handler: function(request, reply) {
                if(request.auth.isAuthenticated) {
                    return reply.redirect('/profile');
                }
            }
        }
    },

//User account page
    {
        method: 'GET',
        path: '/account',
        config: {
            handler: function(request, reply) {
                if(request.auth.isAuthenticated) {
                    return reply.redirect('/profile');
                }
                else {
                        reply.view('account');
                }
            }
        }
    },

//User can edit their account details
    {
        method: 'POST',
        path: '/account',
        config: {
            handler: function(request, reply) {
                if(request.auth.isAuthenticated) {
                    return reply.redirect('/profile');
                }
                else {
                    console.log("are we getting post request");
                    var title = request.payload.title;
                    var summary = request.payload.summary;
                    var price = request.payload.price;

                    db.addJob(title, summary, price, function(err, data) {
                        console.log("is it displaying account page");
                        reply.view('account');
                    });
                }
            }
        }
    },


    {
        method: 'GET',
        path: '/login',
        config: {
            auth: 'google',
            handler: function (request, reply) {
                var g = request.auth.credentials;
                var profile = {
                    name: g.profile.displayName,
                    email: g.profile.email,
                    picture: g.profile.raw.picture,
                };
                // if (true) {
                    // request.auth.session.clear();
                request.auth.session.set(profile);
                return reply.redirect('/');
                // }
                // else {
                //  reply('You're not logged in pal!');    
                // }
            }
        }    
    },

//Page to view all job posts
    {
        method: 'GET',
        path: '/jobs',
        config: {
            handler: function(request, reply) {
                if(request.auth.isAuthenticated) {
                    return reply.redirect('/login');
                }
                else {
                    db.getAllJobs(function (err, data) {
                        reply.view('jobs', {jobs: "data"} );
                    });
                }
            }
        }
    },

//Directs user to stripe login page
    {
        method: 'GET',
        path: '/authorize',
        config: {
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
        config: {
            handler: function(request, reply){
                var code = request.query.code;
                req.post({
                    url: token_uri,
                    form: {
                        grant_type: 'authorization_code',
                        client_id: creds.stripe_clientid,
                        code: code,
                        client_secret: creds.stripe_testsecret
                    }
                }, function(err, r, body) {
                    var userdetails = JSON.parse(body);
                });
            }
        }
    },


];