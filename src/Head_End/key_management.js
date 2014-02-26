/*
Filename:	key_management.js
Author:		Mave Yeap
Date:		Feb, 2014
[DESCRIPTION]: Headend Key Management Server.
*/


/*external configuration*/
var config = require('./config/setting.js');
var db = require('./config/database.js');
var functions = require('./functions/functions.js');
var jsonSocket = require('json-socket');
var key_m = require('./config/key_m.js');
var moment = require('moment');
var net	= require('net');
/*Variable Declaration*/

/**/
net.createServer(function(connection) {
	var date_t = moment().format('lll');
	socket = new jsonSocket(connection);

	socket.on('message', function(message) {
		if(config.debug) {
			console.log('[' + date_t + '] [IFO] *Meter validation request received from "' + message.m_uid + '"');
		}
		functions.meter_validation(db.host, db.name, db.userid, db.passwd, message.m_uid, function(callback) {
			if(callback) {
				m_key = functions.randomString(16, '0123456789');
				m_passwd = functions.randomString(20, '0123456789');
				s_key = message.m_manufacturer + functions.randomString(24, 'ABCDEF0123456789');
				functions.insert_validation(db.host, db.name, db.userid, db.passwd, message.m_uid, message.m_manufacturer,
					message.m_model, message.m_hwver, message.m_fwver, message.c_uid, message.c_manufacturer, message.c_model,
					message.c_hwver, message.c_fwver, m_key, m_passwd, s_key, function(callback) {
					if(callback) {
						if(config.debug) {
							console.log('[' + date_t + '] [SUC] *Meter validation information update successful!');
						}
						socket.sendMessage({
							status: 'VALID', m_key: m_key, m_passwd: m_passwd, s_key: s_key
						});
					} else {
						if(config.debug) {
							console.log('[' + date_t + '] [ERR] *Meter validation information update failed!');
						}
					}
				});
			}
		});
	});

}).listen(key_m.port, key_m.host);
date_t = moment().format('lll');
console.log('::AMI Key Management Server [' + key_m.host + ':' + key_m.port + ']::');
