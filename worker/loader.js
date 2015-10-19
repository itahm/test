; "use strict" ;

var xhr = new XMLHttpRequest(),
	data = {};

xhr.open("GET", "../json/icon.json", false);
xhr.send();

if (xhr.status === 200) {
	data.icon = JSON.parse(xhr.responseText);
}

xhr.open("GET", "../json/device.json", false);
xhr.send();

if (xhr.status === 200) {
	data.device = JSON.parse(xhr.responseText);
}

postMessage(data);