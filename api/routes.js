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

//Homepage
    {
        method: 'GET',
        path: '/',
        config: {auth: {mode: 'optional'},
            handler: function(request, reply) {
                if(request.auth.isAuthenticated) {
                    return reply.redirect('/profile');
                } else {
                    reply.view('homepage', {key: creds.stripe_testpk});
                }
            }
        }
    },

    //Login clears session, sets session and adds users into database
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
                    gender: g.raw.male,
                    jobs: "hello",
                    usertype: "nouser"
                };
                request.auth.session.clear();
                request.auth.session.set(profile);
                db.addDetails(profile.id, profile.username, profile.displayname, profile.firstname, profile.lastname, profile.email, profile.link, profile.picture, profile.gender,
                function(err, data) {
                    reply.redirect('/usertype');
                });
            }
        }    
    },

    {
        method: 'GET',
        path: '/usertype',
        config: {
            auth: 'camunity-cookie',
            handler: function(request, reply) {
                reply.view('usertype');
            }
        }
    },

     {
        method: 'POST',
        path: '/client',
        config: {
            auth: 'camunity-cookie',
            handler: function(request, reply) {
                request.auth.session.set('usertype', 'client');
                reply.redirect('/profile');
            }
        }
    },

     {
        method: 'POST',
        path: '/photographer',
        config: {
            auth: 'camunity-cookie',
            handler: function(request, reply) {
                request.auth.session.set('usertype', 'photographer');
                reply.redirect('/profile');
            }
        }
    },

//User profile page shows google credentials
    {
        method: 'GET',
        path: '/profile',
        config: {
            auth: 'camunity-cookie',
            handler: function(request, reply) {
                console.log('what user am i? ' + request.auth.credentials.usertype);
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
                    var photographer = [];
                    var stripeId = "cash, money, code";
                    var token = "Ummm";

                    db.addJob(title, summary, price, client, photographer, stripeId, token, function(err, data) {
                        reply.redirect('/jobs');
                    });
            }
        }
    },

//Individual job that allows photographers to apply for
    {
        method: 'GET',
        path: '/jobs/{id}',
        config: {
            auth: 'camunity-cookie',
            handler: function(request, reply) {
                db.getAllJobs(function(err, data) {
                    var id = mongojs.ObjectId(request.params.id);
                    db.getOneJob(id, function(err2, job){
                        var usertype = request.auth.credentials.usertype;
                        reply.view('eachjob', {jobs: data, thisJob: job, key: creds.stripe_testpk, usertype: usertype} );
                    });
                });
            }
        }
    },

//Job_id session is set on application
    {
        method: 'POST',
        path: '/jobs/{id}',
        config: {
            auth: 'camunity-cookie',
            handler: function(request, reply) {
                var jobId = request.params.id;
                request.auth.session.set('jobs', jobId);

                if(request.auth.credentials.usertype == 'photographer') {
                    reply.redirect('/authorize');
                } else if (request.auth.credentials.usertype == 'client') {
                    
                    var token = request.payload.stripeToken;
                    var card = request.payload.stripeTokenType;
                    var email = request.payload.stripeEmail;
                    
                    var id = mongojs.ObjectId(jobId)
                    db.updateToken(id, token, function(err, data) {
                        reply.redirect('/myjobs');
                    })
                }
            }
        }
    },

//Client can see jobs he has created
    {
        method: 'GET',
        path: '/myjobs',
        config: {
            auth: 'camunity-cookie',
            handler: function(request, reply) {
                    var name = request.auth.credentials.displayname;
                    db.getMyJobs(name, function(err, jobs){
                        reply.view('myjobs', {jobs: jobs, key: creds.stripe_testpk});
                    });
            }
        }
    },

    {
        method: 'POST',
        path: '/myjobs',
        config: {
            auth: 'camunity-cookie',
            handler: function(request, reply) {
                var id = request.params.id;
                request.auth.session.set('jobs', id)

                var token = request.payload.stripeToken;
                var card = request.payload.stripeTokenType;
                var email = request.payload.stripeEmail;
                var numbers = "55146978c56c8fc621324cbd";
                var id = mongojs.ObjectId(numbers);

                db.updateToken(id, token, function(err, data) {
                    console.log(data);
                    reply.redirect('/myjobs');
                })
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
                    var usertype = request.auth.credentials.usertype;
                    reply.view('jobs', {jobs: data, usertype: usertype} );
                });
            }
        }
    },

//Directs user to stripe login page
    {
        method: 'GET',
        path: '/authorize',
        config: {
            auth:'camunity-cookie',
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

//Callback route after /authorize
//Database saves name, job_id and stripe_id
    {
        method: 'GET',
        path: '/oauth',
        config: {
            auth: 'camunity-cookie',
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
                    var name = request.auth.credentials.displayname;
                    var userdetails = JSON.parse(body);
                    
                    var id = mongojs.ObjectId(request.auth.credentials.jobs);
                    
                    db.getOneJob(id, function(error, data) {
                        
                        var object = {'name' : name, 'stripeid': userdetails.stripe_user_id};
                        
                        db.updateJob(id, object, function(err, data) {
                            request.auth.session.set('jobs', 'jason was here');
                            reply.redirect('/jobs');
                        });

                    })
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

//Mock version works
    {
        method: 'POST',
        path: '/jobcompleted',
        config: {
            auth: 'camunity-cookie',
            handler: function(request, reply) {
                var numbers = "55146978c56c8fc621324cbd";
                var id = mongojs.ObjectId(numbers);

                db.getOneJob(id, function(err, data) {

                    var charge = stripe.charges.create({
                        amount: data.price,
                        currency:"gbp",
                        source: data.token,
                        destination: data.photographer[0].stripeid,
                    }, function(err, charge) {
                        if (err && err.type === 'StripeCardError') {
                            console.log("stripe error");
                        }
                        reply('Job completed');
                    });

                });
            }
        }
    },

    //Logout
    {
        method: 'GET',
        path: '/logout',
        config: {
            auth: 'camunity-cookie',
            handler: function(request, reply) {
                request.auth.session.clear();
                reply.redirect('/');
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