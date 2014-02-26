/*
Filename:	meter.js
Author:		Mave Yeap
Date:		Feb, 2014
[DESCRIPTION]: Meter main program.
*/


/*external configuration*/
var config = require('./config/setting.js');
var db = require('./config/database.js');
var functions = require('./functions/functions.js');
var jsonSocket = require('json-socket');
var meter = require('./config/meter.js');
var moment = require('moment');
var mva = require('./config/mva.js');

/*Variable declaration*/
var date_t = moment().format('lll');
var msg_once = true;
var validated = false;
/*var date_t = new Date();*/

if(config.debug) {
	console.log('::AMI Meter::');
}

function main() {
	/*date_t = new Date();*/
	date_t = moment().format('lll');
	/*Checking meter validation*/
	if(!validated) {
		functions.meter_check(db.host, db.name, db.userid, db.passwd, meter.meter_uid, function(callback) {
			if(callback == '0000000000000000') {
				/*Meter unvalidated*/
				if(msg_once) {
					if(config.debug) {
						console.log('[' + date_t + '] [IFO] *Registering new meter with MVA Server.');
					}
					msg_once = false;
				}
				/*Send requsting to MVA*/
				jsonSocket.sendSingleMessageAndReceive(mva.port, mva.host, {
					m_uid: meter.meter_uid, m_manufacturer: meter.meter_manufacturer, m_model: meter.meter_model,
					m_hwver: meter.meter_hwver, m_fwver: meter.meter_fwver, c_uid: meter.comm_uid, c_manufacturer: meter.comm_manufacturer,
					c_model: meter.comm_model, c_hwver: meter.comm_hwver, c_fwver: meter.comm_fwver, m_key: meter.master_key,
					m_passwd: meter.password, s_key: meter.session_key
				}, function(err, response) {
					if(err) {
						/*Error occur when connecting to MVA*/
						if(config.debug) {
							console.log('[' + date_t + '] [ERR] * MVA Server is not connected! Keep connecting...');
						}
					} else {
						if(response.status == 'VALID') {
							functions.update_key(db.host, db.name, db.userid, db.passwd, meter.meter_uid, response.m_key, response.m_passwd, response.s_key, function(callback) {
								if(callback) {
									console.log('[' + date_t + '] [SUC] *Meter registration completed.');
									validated = true;
								}
							});
						}
					}
				});
			} else {
				/*Meter already validated with MVA*/
				if(config.debug) {
					console.log('[' + date_t + '] [IFO] *Meter already validated!');
				}
				validated = true;
			}
		});
	}
}

(function run() {
	setTimeout(function() {
		main();
		run();
	}, 5000);
}());
