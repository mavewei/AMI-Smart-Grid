/*
Filename: 	drop_db.js
Author: 	Mave Yeap
Date: 		Feb, 2014
[DESCRIPTION]: Drop database script.
*/


/*external configuration*/
var meter = require('../Smart_Meter/config/database.js');
var concentrator = require('../Concentrator/config/database.js');
var headend = require('../Head_End/config/database.js');
var functions = require('./functions/functions.js');

/*Variable declaration*/
var date_t = new Date();
var args = process.argv.splice(2);

/*Main Program*/
if(args == 'h') {
	/*Head-end configuration*/
	host = headend.host;
	name = headend.name;
	userid = headend.userid;
	passwd = headend.passwd;
} else if(args == 'c') {
	/*Concentrator configuration*/
	host = concentrator.host;
	name = concentrator.name;
	userid = concentrator.userid;
	passwd = concentrator.passwd;
} else if(args == 'm') {
	/*Meter configuration*/
	host = meter.host;
	name = meter.name;
	userid = meter.userid;
	passwd = meter.passwd;
} else {
	console.log('\n[' + date_t + ']');
	console.log('::AMI Database Droping Script::');
	console.log('USAGE: drop_db.js [h|c|m]');
	console.log('	h: Drop head-end database.');
	console.log('	c: Drop concentrator databse.');
	console.log('	m: Drop meter databse.\n');
	return -1;
}

functions.drop_db(host, name, userid, passwd);
