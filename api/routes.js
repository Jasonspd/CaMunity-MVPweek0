var Path = require('path');
var jade = require('jade');
var Joi = require('joi');
var mongojs = require('mongojs');
var creds = require('../creds.json');
// var db = require('./database.js');
var stripe = require("stripe")("sk_test_stripe.setApiKey()"+creds.stripe_testsecret_keyonly);
var token_uri = 'https://connect.stripe.com/oauth/token';

var qs = require('querystring');
var req = require('request');
var code;

module.exports = [

{
    method: 'GET',
    path: '/public/css/{filename}',
    config: {
        handler: function(request, reply) {
            reply.file(__dirname + "/../public/css/" + request.params.filename);
        }
    }
},

{
    method: 'GET',
    path: '/public/lib/{filename}',
    config: {
        handler: function(request, reply) {
            reply.file(__dirname + "/../public/lib/" + request.params.filename);
        }
    }
},

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

{
    method: 'GET',
    path: '/loginc',
    config: {
        handler: function(request, reply) {
            if(request.auth.isAuthenticated) {
                return reply.redirect('/profile');
            }
            else {
                reply('Sign in to twitter for example');
            }
        }
    }
},

{
    method: 'GET',
    path: '/loginp',
    config: {
        handler: function(request, reply) {
            if(request.auth.isAuthenticated) {
                return reply.redirect('/profile');
            }
            else {
                console.log(request.query);
                reply(request.query);
            }
        }
    }
},

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

// {
//     method: 'GET',
//     path: '/oauth',
//     config: {
//         handler: function(request, reply) {
//             var code = request.query.code;

//             req.post({
//                 url: TOKEN_URI,
//                 form: {
//                     grant_type: 'authorization_code',
//                     client_id: stripe_client_id,
//                     code: code,
//                     client_secret: stripe_testsecret
//                 }
//             }, function(err, r, payload) {

//                 var accessToken = JSON.parse(payload).access_token;

//                 reply({'Your Token' : accessToken})
//             })
//         }
//     }
// },s

{
    method: 'GET',
    path: '/oauth',
    config: {
        handler: function(request, reply){
            code = request.query.code;
            reply.redirect('/loginsuccess');
        }
    }
},

{
    method: 'GET',
    path: '/loginsuccess',
    config: {
        handler: function(request, reply) {
            reply.redirect(TOKEN_URI + qs.stringify({
                grant_type: 'authorization_code',
                client_id: creds.stripe_client_id,
                code: code,
                client_secret: creds.stripe_testsecret
            }));
        }
    }
},



];