/*
Filename: 	simulation.js
Author: 	Mave Yeap
Date: 		Feb, 2014
[DESCRIPTION]: Simulation file.
*/


/*Simulation Configuration*/
module.exports.configuration = function(option) {
	if(option) {
		/*Debug mode*/
		module.exports.faulty_percentage = 5;
		module.exports.normal_interval = 30;		/*In seconds*/
		module.exports.normal_interval_max = 5;		/*In seconds*/
		module.exports.normal_interval_min = 1;		/*In seconds*/
		module.exports.faulty_interval_max = 15;	/*In seconds*/
		module.exports.faulty_interval_min = 5;		/*In seconds*/
		module.exports.del_kwh_max = 0.15000;
		module.exports.del_kwh_min = 0.07500;
	} else {
		/*Normal mode*/
		module.exports.faulty_percentage = 20;
		module.exports.normal_interval = 15;		/*In minutes*/	/**DEBUG**/
		module.exports.normal_interval_max = 1;		/*In minutes*/
		module.exports.normal_interval_min = 1;		/*In seconds*/
		module.exports.faulty_interval_max = 3;		/*In minutes*/
		module.exports.faulty_interval_min = 1;		/*In minutes*/
		module.exports.del_kwh_max = 0.15000;
		module.exports.del_kwh_min = 0.07500;
	}
}