/*
Filename: 	init.js
Author: 	Mave Yeap
Date: 		Feb, 2014
[DESCRIPTION]: Meter initialization files.
*/

/*external configuration*/
var db = require('./config/database.js');
var functions = require('./functions/functions.js');

/*Creating MySQL database*/
functions.initialization(db.host, db.name, db.userid, db.passwd);
