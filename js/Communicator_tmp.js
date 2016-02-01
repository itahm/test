;"use strict";

var demoData = {};

function Communicator() {
	this.connect = function (server, port) {
	},
	
	this.close = function () {
	},
	
	this.send = function (data, callback) {
		callback(processRequest(data), 200);
	};
}

function processRequest(data) {
	var c = data.command;
	
	if (c === "pull") {
		if (data.database === "device") {console.log(demoData);
			return demoData.device;
		}
		else if (data.database === "icon") {
			return {};
		}
	}
	else if (c === "select") {
		return demoData.snmp;
	}
	else if (c === "query") {
		return demoData.responseTime;
	}
	else if (c === "echo") {
		return {};
	}
	else if (c === "signin") {
		return {};
	}
}
