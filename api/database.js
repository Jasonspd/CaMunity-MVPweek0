var mongojs = require("mongojs");
var creds = require("../creds.json");
// var db = mongojs("mylocaldatabase", ['user']);
var db = mongojs(creds.dbname + ":" + creds.dbpwd + creds.dburl, ['users', 'tokens', 'jobs']);

db.on('error',function(err) {
    console.log('database error', err);
});

db.on('ready',function() {
    console.log('database connected');
});

function user(id, username, displayname, firstname, lastname, email, link, picture, gender) {
	this.id = id;
	this.username = username;
	this.displayname = displayname;
	this.firstname = firstname;
	this.lastname = lastname;
	this.email = email;
	this.link = link;
	this.picture = picture;
	this.gender = gender;
	this.datejoined = new Date();
}

function addDetails(id, username, displayname, firstname, lastname, email, link, picture, gender, callback) {
	var newUser = new user(id, username, displayname, firstname, lastname, email, link, picture, gender);
	db.users.save(newUser, function (err,data){
		if (err) {
			return callback(err, null);
		}
		else {
			console.log('User saved: ',data);
			return callback(null, data);
		}
	});
}


function job(title, summary, price, client, dateAdded) {
	this.title = title;
	this.summary = summary;
	this.price = price;
	this.client = client;
	this.dateAdded = new Date();
}


function addJob(title, summary, price, client, callback) {
	var newJob = new job(title, summary, price, client);
	db.jobs.save(newJob, function (err, data) {
		if (err) {
			return callback(err, null);
		}
		else {
			console.log('Job saved: ', data);
			return callback(null, data);
		}
	});
}

function getAllJobs(callback) {
	db.jobs.find(function (err, data) {
		if (err) {
			return callback(err, null);
		}
		else {
			return callback(null, data);
		}
	});
}

function token(stripetoken, dateAdded) {
	this.stripetoken = stripetoken;
	this.dateAdded = new Date();
}

function addToken(stripetoken, callback) {
	var newToken = new token(stripetoken);
	db.tokens.save(newToken, function (err, data) {
		if (err) {
			return callback(err, null);
		}
		else {
			console.log('Token saved: ', data);
			return callback(null, data);
		}
	});
}

function getToken(callback) {
	console.log("Token about to be found from database");
	db.tokens.findOne( {stripetoken: "tok_15kFxEBgUq50mWzrm8xofax8"}, function (err, data) {
		if (err) {
			return callback(err, null);
		}
		else {
			console.log("Actually found token");
			return callback(null, data);
		}
	});
}

module.exports = {
	getToken: getToken,
	addToken: addToken,
	addDetails: addDetails,
	addJob: addJob,
	getAllJobs: getAllJobs
};