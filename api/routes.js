var jade = require('jade');
var creds = require('../creds.json');

var db = require('./database.js');
var mongojs = require('mongojs');
var Joi = require('joi');

var stripe = require("stripe")(creds.stripe_testsecret)
var token_uri = 'https://connect.stripe.com/oauth/token';

var qs = require('querystring');
var req = require('request');

//Exporting to server.js
module.exports = [

//Routing for css
{
    method: 'GET',
    path: '/public/css/{filename}',
    config: {
        handler: function(request, reply) {
            reply.file(__dirname + "/../public/css/" + request.params.filename);
        }
    }
},

//Routing for jquery
{
    method: 'GET',
    path: '/public/lib/{filename}',
    config: {
        handler: function(request, reply) {
            reply.file(__dirname + "/../public/lib/" + request.params.filename);
        }
    }
},

//Example charge
{
    method: 'POST',
    path: '/stripe',
    config: {
        handler: function (request, reply) {
            console.log("stripe Token: " + request.payload.stripeToken);
            var stripeToken = request.payload.stripeToken;
            var charge = stripe.charges.create({
                amount:2000,
                currency:"gbp",
                source: stripeToken,
                description: "itookyourmoney@email.com"
            }, function(err, charge) {
                if (err && err.type === 'StripeCardError') {
                    console.log("stripe error");
                }
            console.log("success");
            });
            reply(request.payload);
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
            else {
                reply.view('profile');
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
                    reply.view('account', {title: "Your Account"});
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
                })
            }
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

//Creating the customers
                stripe.customers.create(
                    {description: "example@stripe.com"},
                    {stripe_account: userdetails.stripe_user_id}
                    );

                reply(userdetails + body);
            });
        }
    }
},

//webhooks
{
    method: 'POST',
    path: '/my/mywebhook/url',
    config: {
        handler: function(request, reply) {
            var event_json = JSON.parse(request.payload);
            console.log("An event has happened: " + event_json);
            reply(200);
        }
    }
},

{
    method: 'GET',
    path: '/my/mywebhook/url',
    config: {
        handler: function(request, reply) {
            console.log("something has happened");
            reply(200);
        }
    }
},

{
    method: 'GET',
    path: '/status',
    config: {
        handler: function(request, reply) {
            reply.view('status', {key: creds.stripe_testpk});
        }
    }
},

{
    method: 'POST',
    path: '/status',
    config: {
        handler: function(request, reply) {
            var stripeToken = request.payload.stripeToken;
            db.addToken(stripeToken, function(err, data) {
                reply.view('status', {key: creds.stripe_testpk});
            });
        }
    }
},

{
    method: 'POST',
    path: '/jobcompleted',
    config: {
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



];