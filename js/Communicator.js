;"use strict";

function Communicator(server, port) {
	var xhr = new XMLHttpRequest(),
		url = "http://"+ server + (port? (":"+ port): ""),
		dataQ = [],
		callbackQ = [];
	
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
			response = JSON.parse(xhr.responseText);
		}
		
		callbackQ.shift()(response);
		
		if (data) {
			send(data);
		}
	};
	
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
