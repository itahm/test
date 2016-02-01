;"use strict";

function Communicator() {
	var xhr, url, dataQ, callbackQ;
	
	init();
	
	function init() {
		dataQ = [];
		callbackQ = [];
	}
	
	function send(data) {
		if (!xhr) {
			if (url) {
				xhr = new XMLHttpRequest();
			}
			else {
				throw "closed.";
			}
		}
		
		xhr.open("POST", url, true);
		xhr.onloadend = onLoad;
		xhr.timeout = 3000;
		xhr.withCredentials = true;
		xhr.send(JSON.stringify(data));
	}
	
	function onLoad(e) {
		var data = dataQ.shift(),
			response = xhr.responseText;
		
		callbackQ.shift()((response && response.length > 0)? JSON.parse(response): {}, xhr.status);
		
		if (data) {
			send(data);
		}
	};
	
	this.connect = function (server, port) {
		xhr = new XMLHttpRequest();
		url = "http://"+ server + (port? (":"+ port): "")
	},
	
	this.close = function () {
		xhr = undefined;
		url = undefined;
		
		init();
	},
	
	this.send = function (data, callback) {
		if (callbackQ.length == 0) {
			send(data);
		}
		else {
			dataQ.push(data);
		}
		
		callbackQ.push(callback);
	};
}
