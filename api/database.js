var mongojs = require("mongojs");
var creds = require("../creds.json");
// var db = mongojs("mylocaldatabase", ['user']);
var db = mongojs(creds.dbname + ":" + creds.dbpwd + creds.dburl, ['user', 'tokens']);

db.on('error',function(err) {
    console.log('database error', err);
});

db.on('ready',function() {
    console.log('database connected');
});

function user(username, email, firstname, lastname, summary, website) {
	this.username = username;
	this.email = email;
	this.firstname = firstname;
	this.lastname = lastname;
	this.summary = summary;
	this.website = website;
	this.datejoined = new Date();
}

function addDetails(username, email, firstname, lastname, summary, website, callback) {
	var newUser = new user(username, email, firstname, lastname, summary, website);
	db.user.save(newUser, function (err,data){
		if (err) {
			return callback(err, null);
		}
		else {
			console.log('User saved: ',data);
			return callback(null, data);
		}
	});
}


function job(title, summary, price, dateAdded) {
	this.title = title;
	this.summary = summary;
	this.price = price;
	this.dateAdded = new Date();
}

function addJob(title, summary, price, callback) {
	console.log("is it running function?")
	var newJob = new job(title, summary, price);
	db.user.save(newJob, function (err, data) {
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
	db.user.find(function (err, data) {
		if (err) {
			return callback(err, null);
		}
		else {
			console.log();
			return callback(null, data);
		}
	});
}

function token(stripetoken, dateAdded) {
	this.stripetoken = stripetoken;
	this.dateAdded = new Date();
}

function addToken(stripetoken, callback) {
	console.log("Token is about to be added to the database");
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