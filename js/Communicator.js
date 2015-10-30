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
			xhr = new XMLHttpRequest();
		}
		
		xhr.open("POST", url, true);
		xhr.onload = onLoad;
		xhr.withCredentials = true;
		xhr.send(JSON.stringify(data));
	}
	
	function onLoad(e) {
		var data = dataQ.shift(),
			response;
	
		if (xhr.status === 200) {
			var text = xhr.responseText;
			response = text.length > 0? JSON.parse(text): {};
		}
		
		callbackQ.shift()(xhr.status, response);
		
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
