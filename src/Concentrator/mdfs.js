/*
Filename:	mdfs.js
Author:		Mave Yeap
Date:		Feb, 2014
[DESCRIPTION]: Concentrator MDFS Server.
*/


/*external configuration*/
var config = require('./config/setting.js');
var mdfs = require('./config/mdfs.js');
var moment = require('moment');
var net = require('net');
var jsonSocket = require('json-socket');
/*Variable declaration*/

/**/
net.createServer(function(connection) {
	var date_t = moment().format('lll');
	socket = new jsonSocket(connection);

	socket.on('message', function(message) {
		if(config.debug) {
			console.log('[' + date_t + '] [IFO] *Received meter data from "' + message.meter_identi + '".');
		}
	});

	sock.on('error', function(err) {
		console.log('Caught Flash policy server socket error: ');
		console.log(err.stack);
	});
}).listen(mdfs.port, mdfs.host);
console.log('::AMI MDFS Server [' + mdfs.host + ':' + mdfs.port + ']::');
