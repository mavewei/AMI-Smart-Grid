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
var validated = false;
var msg_once = true;
/*var date_t = new Date();*/

if(config.debug) {
	console.log('::AMI Meter::');
}

function main() {
	/*date_t = new Date();*/
	var date_t = moment().format('lll');
	/*Checking meter validation*/
	if(!validated) {
		functions.meter_check(db.host, db.name, db.userid, db.passwd, meter.meter_identi, function(callback) {
			if(callback == '0000000000000000') {
				/*Meter unvalidated*/
				if(msg_once) {
					if(config.debug) {
						console.log('[' + moment().format('lll') + '] *Registering new meter with MVA Server.');
					}
					msg_once = false;
				}
				/*Send requsting to MVA*/
				jsonSocket.sendSingleMessageAndReceive(mva.port, mva.host, {
					m_uid: meter.meter_uid, m_manufacturer: meter.meter_manufacturer, m_model: meter.meter_model,
					m_hwver: meter.meter_hwver, m_fwver: meter.meter_fwver, c_uid: meter.comm_uid, c_manufacturer: meter.comm_manufacturer,
					c_model: meter.comm_model, c_hwver: meter.comm_hwver, c_fwver: meter.comm_fwver
				}, function(err, response) {
					if(err) {
						/*Error occur when connecting to MVA*/
						if(config.debug) {
							console.log('[' + date_t + '] [ERR] * MVA Server is not connected! Keep connecting...');
						}
					} else {
						console.log('response');
					}
				});


			} else {
				/*Meter already validated with MVA*/
				if(config.debug) {
					console.log('[' + date_t + '] [SUC] *Meter already validated!');
				}
			}
		});
	}
}

(function run() {
	setTimeout(function() {
		main();
		run();
	}, 2000);
}());