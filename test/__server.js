var lab 	= exports.lab = require('lab').script();
var assert 	= require('chai').assert;
var server 	= require('../api/server.js');


// TESTING THE HOMEPAGE
lab.experiment("When a user visits our homepage", function() {
	var options = {
		url: '/',
		method: 'GET'
	};
	
	lab.test("it should exist", function(done) {
		server.inject(options, function(response) {
			assert.equal(response.statusCode, 200, 'it should exist and return status code 200');
			done();
		});
	});

	lab.test("it should load any images we have on our page", function(done) {

	});

	lab.test("it should display our company name", function(done) {

	});

	lab.test("they should be click a login button which redirects to the twitter autentication login page", function(done) {

	});

});



// TESTING THE LOGIN PAGE
lab.experiment("When a user has logged in", function() {

	lab.test("their credentials should be stored in our database", function(done){

	});

	lab.test("they should be directed to their personal profile page", function(done){

	});

	lab.test("login information should be cached so user remains logged in", function(done){

	});

});



// TESTING THE PROFILE PAGE
lab.experiment("When a user visits their personal profile page", function() {
	var options = {
		url: '/profile',
		method: 'GET'
	};

	lab.test("it should exist", function(done){
		server.inject(options, function(response) {
			assert.equal(response.statusCode, 200, 'it should exist and return status code 200');
			done();
		});
	});

	lab.test("it should be populated using twitter information", function(done){

	});

	lab.test("it should have an edit button that redirects you to an edit your profile page", function(done){

	});
	
	lab.test("it should be populated using data from our database", function(done){

	});

});	



// TESTING THE EDIT PAGE
lab.experiment("When a user visits their personal editting page", function() {

	lab.test("it should display new information on their personal profile once editing has been saved", function(done){

	});

	lab.test("it should make adds, edits and updates to the database", function(done){

	});

});



// TESTING THE PHOTGRAPHER PROFILE PAGE
lab.experiment("When a Photograher user visits their personal profile page", function() {

	lab.test("they should be able to upload a profile photo which adds to our database or updates in our database", function(done){

	});

	lab.test("it should have a contact button which enables users to contact them", function(done){

	});

	lab.test("they should be able to upload their portfolios", function(done){

	});

	lab.test("they should be able to enlarge their uploaded portfolio photos and view all", function(done){

	});		

});



// TESTING THE CLIENT PROFILE PAGE
lab.experiment("When a Client user visits their personal profile page", function() {

	lab.test("they should be able to upload a new job", function(done){

	});

	lab.test("it should display any jobs the user has posted", function(done){

	});

	lab.test("it should have a contact button which enables users to contact them", function(done){

	});

});



// TESTING THE JOB POSTS PAGE
lab.experiment("When a user visits the job posts page", function() {
	var options = {
		url: '/jobposts',
		method: 'GET'
	};

	lab.test("it should exist", function(done){
		server.inject(options, function(response) {
			assert.equal(response.statusCode, 200, 'it should exist and return status code 200');
			done();
		});
	});

	lab.test("it should display all jobs all Client users have posted", function(done){

	});

	lab.test("it should allow a user apply for a job", function(done){

	});

});



// TESTING THE STATUS-SO-FAR PAGE
lab.experiment("When a user visits the status-so-far page", function() {

	lab.test("it should state the current progress of any job shared between a Client and a Photgrapher", function(done){

	});

});



// TESTING THE PAYMENTS
lab.experiment("When a Client user wants to make a payment with Stripe", function() {

	lab.test("it should prompt user to fill in details", function(done){

	});

	lab.test("it should deposit money into the Stripe account", function(done){

	});

	lab.test("it should hold the money until the job is complete", function(done){

	});

	lab.test("it should transfer the funds to the Photographer upon completion", function(done){

	});

});

