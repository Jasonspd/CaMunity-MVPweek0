var lab 	= exports.lab = require('lab').script();
var assert 	= require('chai').assert;
var server 	= require('../api/server.js');

lab.exeriment("When...", function() {
	var options = {
		url: '/',
		method: 'GET'
	};
	lab.test("Return...", function(done) {
		server.inject(options, function(response) {
			assert.equal(response.statusCode, 200, 'it should...');
			done();
		});
	});
});