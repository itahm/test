; "use strict" ;

var xhr = new XMLHttpRequest(),
	dataList = [
	["router", "192.168.0.254", "interface", "g0/1", "up", "down", "interface down"],
	["switch", "192.168.0.10", "processor", "0", "68%", "95%", "processor load warning"],
	["server", "172.16.24.21", "disk", "etc/tmp", "89%", "91%", "disk usage warning"],
	["workgroup", "192.168.100.9", "interface", "f0/11", "32%", "83", "traffic warning"],
	["workgroup", "192.168.200.3", "interface", "f0/1", "down", "up", ""],
	["firewall", "7,7,99,100", "memory", "0", "91%", "78%", ""]],
	length = dataList.length,
	indx = 0,
	i = 0;

sendRequest();

function sendRequest() {
	setTimeout(sendRequest, (Math.random() *(20 + i)) *1000);
	
	onEvent();
}

function onEvent(data) {
	data = dataList[i++ % length];
	
	postMessage(makeData(new Date().getTime(), data[0], data[1], data[2], data[3], data[4], data[5], data[6]));
}

/**
 * @param {Number} timeStamp
 * @param {String} sysName
 * @param {String} ipAddr
 * @param resource
 * @param index
 * @param lastStatus
 * @param currentStatus
 * @param {String} text
 */
function makeData(timeStamp, sysName, ipAddr, resource, index, lastStatus, currentStatus, text) {
	var data = {}
	
	data[indx++] = {
		timeStamp:new Date(timeStamp).toLocaleString(),
		sysName: sysName,
		ipAddr: ipAddr,
		resource: resource,
		index: index,
		lastStatus: lastStatus,
		currentStatus: currentStatus,
		text: text
	}
	
	return data;
}