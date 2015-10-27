;"use strict";

var ITAhM = {};

(function (window, undefined) {
	ITAhM.fireEvent = function (type, element) {
		var event = document.createEvent("Event");
		
		event.initEvent(type, true, true);
		element.dispatchEvent(event);
	}
	
	ITAhM.download = function (blob, fileName) {
		if (window.navigator.msSaveBlob) {
			window.navigator.msSaveBlob(blob, fileName);
		}
		else {
			var a = document.createElement("a");
				
			a.setAttribute("download", fileName);
			a.setAttribute("href", URL.createObjectURL(blob));
			
			ITAhM.fireEvent("click", a);
		}
	}
}) (window);