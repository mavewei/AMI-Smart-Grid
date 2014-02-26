/*
Filename:	mva.js
Author:		Mave Yeap
Date:		Feb, 2014
[DESCRIPTION]: Concentrator MVA Server.
*/


/*external configuration*/
var config = require('./config/setting.js');
var jsonSocket = require('json-socket');
var key_m = require('./config/key_m.js');
var moment = require('moment');
var mva = require('./config/mva.js');
var net	= require('net');
/*Variable declaration*/

/**/
net.createServer(function(connection) {
	var date_t = moment().format('lll');
	socket = new jsonSocket(connection);
	/*Server receive message from meter*/
	socket.on('message', function(message) {
		if(config.debug) {
			console.log('[' + date_t + '] [IFO] *Meter registration request received from "' + message.m_uid + '"');
		}
		/*Forward meter information to Key Management Server*/
		jsonSocket.sendSingleMessageAndReceive(key_m.port, key_m.host, {
			m_uid: message.m_uid, m_manufacturer: message.m_manufacturer, m_model: message.m_model,
			m_hwver: message.m_hwver, m_fwver: message.m_fwver, c_uid: message.c_uid, c_manufacturer: message.c_manufacturer,
			c_model: message.c_model, c_hwver: message.c_hwver, c_fwver: message.c_fwver, m_key: message.m_key,
			m_passwd: message.m_passwd, s_key: message.s_key
		}, function(err, response) {
			/*Error occur when connecting to Key-management server*/
			if(err) {
				if(config.debug) {
					console.log('[' + date_t + '] [ERR] *Headend Key-management Server is not connected! Keep connecting...');
				}
			} else {
				if(response.status == 'VALID') {
					if(config.debug) {
						console.log('[' + date_t + '] [IFO] *Key of Meter "' + message.m_uid + '" was received from Key-Management Server.');
					}
					socket.sendMessage({
						status: response.status, m_key: response.m_key, m_passwd: response.m_passwd, s_key: response.s_key
					})
				}
			}

		});

	});
	socket.on('error', function(err) {
		console.log('Caught Flash policy server socket error: ');
		console.log(err.stack);
	});

}).listen(mva.port, mva.host);
console.log('::AMI MVA Server [' + mva.host + ':' + mva.port + ']::');
