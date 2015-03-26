var mongojs = require("mongojs");
var creds = require("../creds.json");
// var db = mongojs("mylocaldatabase", ['user']);
var db = mongojs(creds.dbname + ":" + creds.dbpwd + creds.dburl, ['user', 'photographer_user', 'client_user', 'tokens', 'jobs']);

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

//___________________________________________//

function addClientDetails(id, username, displayname, firstname, lastname, email, link, picture, gender, callback) {
	var newUser = new user(id, username, displayname, firstname, lastname, email, link, picture, gender);
	db.client_user.save(newUser, function (err,data){
		if (err) {
			return callback(err, null);
		}
		else {
			console.log('User saved: ',data);
			return callback(null, data);
		}
	});
}

function addPhotographerDetails(id, username, displayname, firstname, lastname, email, link, picture, gender, callback) {
	var newUser = new user(id, username, displayname, firstname, lastname, email, link, picture, gender);
	db.photographer_user.save(newUser, function (err,data){
		if (err) {
			return callback(err, null);
		}
		else {
			console.log('User saved: ',data);
			return callback(null, data);
		}
	});
}

//_______________________________________________//

// job {
// 	_id
// 	job title
// 	job summary
// 	job price
// 	photographer 
// 	token
// 	stripe account user id
// }

function job(title, summary, price, client, photographer, stripeId,
	token, dateAdded) {
	this.title = title;
	this.summary = summary;
	this.price = price;
	this.client = client;
	this.dateAdded = new Date();
	this.photographer = photographer;
	this.stripeId = stripeId;
	this.token = token;
}



function addJob(title, summary, price, client, photographer, stripeId,
	token, callback) {
	var newJob = new job(title, summary, price, client, photographer, stripeId,
	token);
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

function getOneJob(id,callback) {
	db.jobs.findOne( {_id: id}, function(err, data){
		if (err) {
			return callback(err, null);
		}
		else {
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




// db.mycollection.find().sort({name:1}, function(err, docs) {
//     // docs is now a sorted array
// });

function getMyJobs(name, callback) {
	db.jobs.find({client: name}, function(err, data) {
		if (err) {
			return callback(err, null);
		}
		else {
			return callback(null, data);
		}
	});
}


// This is the function for updating job with photographer name
function updateJob (array, callback) {
	db.jobs.update({photographer: array}, function(err, data) {
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
	updateJob: updateJob,
	getOneJob: getOneJob,
	addPhotographerDetails: addPhotographerDetails,
	addClientDetails: addClientDetails,
	getToken: getToken,
	addToken: addToken,
	addDetails: addDetails,
	addJob: addJob,
	getAllJobs: getAllJobs,
	getMyJobs: getMyJobs
};