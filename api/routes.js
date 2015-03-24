var Path = require('path');
var jade = require('jade');
var Joi = require('joi');
var mongojs = require('mongojs');
var creds = require('../creds.json');
// var db = require('./database.js');
var stripe = require("stripe")("sk_test_stripe.setApiKey()mrtOm1IZq62ZieC4vwrQgAvU");

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
    method: 'GET',
    path: '/stripe',
    config: {
        handler: function (request, reply) {
            reply.view('homepage');
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
                description: "anotheremail@email.com"
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
                reply.view('homepage', {link: "https://connect.stripe.com/oauth/authorize?response_type=code&client_id="+creds.stripe_client_id+"&scope=read_write"});
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
                reply.view('homepage');
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
                reply.view('homepage');
            }
        }
    }
},


];