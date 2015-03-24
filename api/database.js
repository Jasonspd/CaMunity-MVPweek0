var mongojs = require("mongojs");
var creds = require("../creds.json");
var db = mongojs("mylocaldatabase", ['user']);
// var db = mongojs(creds.dbname + ":" + creds.dbpwd + creds.dburl, ['user']);

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


function job(title, summary, cost, dateAdded) {
	this.title = title;
	this.summary = summary;
	this.cost = cost;
	this.dateAdded = new Date();
}

function addJob(title, summary, cost, callback) {
	var newJob = new job(title, summary, cost);
	db.job.save(newJob, function (err, data) {
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
	db.job.find(function (err, data) {
		if (err) {
			return callback(err, null);
		}
		else {
			console.log();
			return callback(null, data);
		}
	});
}

module.exports = {
	addDetails: addDetails,
	addJob: addJob,
	getAllJobs: getAllJobs
};