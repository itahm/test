;"use strict";

function Communicator() {
	var xhr, url, dataQ, callbackQ, response;
	
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
		xhr.onload = onSuccess;
		xhr.ontimeout = onTimeout;
		xhr.onloadend = onLoad;
		xhr.timeout = 10000;
		xhr.withCredentials = true;
		xhr.send(JSON.stringify(data));
	}
	
	function onSuccess(e) {
		var text = xhr.responseText;
		
		response = text.length > 0? JSON.parse(text): {};
	};
	
	function onTimeout(e) {
		alert("request timed out.");
	};
	
	function onLoad(e) {
		var data = dataQ.shift();
		
		callbackQ.shift()(response, xhr.status);
		
		if (data) {
			send(data);
		}
	};
	
	this.connect = function (server, port) {
		xhr = new XMLHttpRequest();
		url = "http://"+ server + (port? (":"+ port): "");
		
		return this;
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

Communicator.getInstance = function () {
	return new Communicator();
}

Communicator.xhr = function (host, port, timeout) {
	var xhr = new XMLHttpRequest();
	
	xhr.open("POST", "http://"+ host +":"+ port, true);
	
	if (timeout > 0) {
		xhr.timeout = timeout;
	}
	
	xhr.withCredentials = true;
	
	return new xhr;
}