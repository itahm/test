; "use strict" ;

var xhr = new XMLHttpRequest(),
	data = {};

xhr.open("GET", "../json/icon.json", false);
xhr.send();

if (xhr.status === 200) {
	data.icon = JSON.parse(xhr.responseText);
}

postMessage(data);