; "use strict" ;

var xhr = new XMLHttpRequest();

addEventListener("message", onRequest, false);

function onRequest(e) {
	var request = e.data;
	
	if (!xhr) {
		xhr = new XMLHttpRequest();
	}
	
	xhr.open("POST", request.url, true);
	xhr.onload = onLoad;
	xhr.withCredentials = true;
	xhr.send(JSON.stringify(request.data));
}

function onLoad() {
	var response;
	
	if (xhr.status === 200) {
		response = JSON.parse(xhr.responseText);
	}
	
	postMessage(response);
}