;"use strict";

function Communicator() {
	var xhr, url, dataQ, callbackQ;
	
	init();
	
	function init() {
		dataQ = [];
		callbackQ = [];
	}
	
	function send(data, background) {
		if (!xhr) {
			xhr = new XMLHttpRequest();
		}
		
		if (!background) {
			document.body.classList.add("loading");
		}
		
		response = undefined;
		
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
	
	this.send = function (data, callback, background) {
		if (callbackQ.length == 0) {
			send(data, background);
		}
		else {
			dataQ.push(data);
		}
		
		callbackQ.push(callback);
	};
}
