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
		
		document.body.classList.add("loading");
		
		response = undefined;
		
		xhr.open("POST", url, true);
		xhr.onload = onSuccess;
		xhr.onloadend = onLoad;
		xhr.timeout = 3000;
		xhr.withCredentials = true;
		xhr.send(JSON.stringify(data));
	}
	
	function onSuccess(e) {
		var text = xhr.responseText;
		
		response = text.length > 0? JSON.parse(text): {};
	};
	
	function onLoad(e) {
		var data = dataQ.shift();
		
		callbackQ.shift()(response, xhr.status);
		
		document.body.classList.remove("loading");
		
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
