;"use strict";

/**
 * @namespace
 */
var ITAhM = ITAhM || {};

Array.prototype.fill = Array.prototype.fill || function (val) {
	for (var i=0; i<this.length; i++) {
		this[i] = val;
	}
	
	return this;
};

(function (window, undefined) {
	
	ITAhM.util = {
		enterpriseFromOID: function (oid) {
			var match = /^1\.3\.6\.1\.4\.1\.(\d+)\./.exec(oid);
			
			if (match) {
				return ITAhM.snmp.enterprise[match[1]];
			}
		},
		
		toBytesString: function (bytes) {
			var unit = ["Bytes", "KBytes", "MBytes", "GBytes", "TBytes"];
			
			for(var i=0, _i=unit.length; i<_i; i++) {
				if (bytes > 999) {
					bytes /= 1024;
				}
				else {
					break;
				}
			}
			
			return bytes.toFixed(2) + unit[i];
		},
		
		toBPSString: function (bandwidth) {
			var unit = ["bps", "Kbps", "Mbps", "Gbps", "Tbps"];
			
			for(var i=0, _i=unit.length; i<_i; i++) {
				if (bandwidth > 999) {
					bandwidth /= 1000;
				}
				else {
					break;
				}
			}
			
			return bandwidth.toFixed(2) + unit[i];
		},
		
		toUptimeString: function (dateMills) {
			var uptime = dateMills /1000,
				days, hours, minutes, seconds;
			
			days = Math.floor(uptime /24 /3600);
			uptime -= days *24 *3600;
			
			hours = Math.floor((uptime /3600));
			uptime -= hours * 3600;
			
			minutes = Math.floor((uptime /60));
			uptime -= minutes * 60;
		
			return days +" days " + hours +" hours " + minutes +" minutes " + Math.floor(uptime) +" seconds";
		},
		
		/**
		 * @param date Date object not integer (mills) 
		 */
		toDateFormatString: function (date) {
			var language = navigator.language;
			
			language = undefined;
			
			if (language === "ko") {
				var format = [date.getMonth() +1, "월", " ", date.getDate(), "일"],
					hour = date.getHours();
				
				if (hour > 0) {
					format.push(" ", hour, "시");
				}
				
				return format.join("");
			}
			else if (language === "en"){
				var day = date.getDate(),
					hour = date.getHours(),
					MONTH_NAME = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
			
				return MONTH_NAME[date.getMonth()] + (day === 1? "" : " "+ (day > 9? "": "0")+ day +", "+ (hour > 9? "": "0") + hour);
			}
			else {
				var month = date.getMonth() +1,
					day = date.getDate(),
					hour = date.getHours();
				
				if (month === 0 && day === 1 && hour === 0) {
					return gate.getFullYear();
				}
				else {
					var min = date.getMinutes();
					
					if (min === 0) {
						return [month<10? "0": "", month, "-", day<10? "0": "", day, hour<10? " 0":" ", hour].join("");
					}
					else {
						return [hour<10? " 0":" ", hour, ":", min > 9? min: "0"+ min].join("");
					}
				}				
			}
		},
		
		toDateString: function (date) {
			var year = date.getFullYear(),
				month = date.getMonth() + 1,
				day  = date.getDate();
			
			return year +"-"+ (month > 9? "": "0") + month +"-"+ (day > 9? "": "0") + day;
		},
		
		download: function(blob, fileName) {
			if (window.navigator.msSaveBlob) {
				window.navigator.msSaveBlob(blob, fileName);
			}
			else {
				var a = document.createElement("a");
					
				a.setAttribute("download", fileName);
				a.setAttribute("href", URL.createObjectURL(blob));
				
				ITAhM.util.fireEvent("click", a);
			}
		},
		
		fireEvent: function (type, element) {
			var event = document.createEvent("Event");
			
			event.initEvent(type, true, true);
			element.dispatchEvent(event);
		},
		
		createCustomEvent: function (type, data) {
			var event = document.createEvent("CustomEvent");
			
			event.initCustomEvent(type, true, true, data);
			
			return event;
		},
		
		toDateTimeString: function (date) {
			return date.toISOString().slice(0, 10) + " "+ date.toTimeString().slice(0, 8)
		},
		
		createCSVData: function (data, keys, summary) {
			var row, block, date, dateMills, value;
			
			if (summary) {
				row = ["index,date,max,avg,min"];
				
				for (var i=0, _i=keys.length; i<_i; i++) {
					block = keys[i];
					
					for (var j=0, _j=block.length; j<_j; j++) {
						dateMills = block[j];
						date = new Date(dateMills);
						value = data[dateMills];
						
						row[row.length] = [j, ITAhM.util.toDateTimeString(date), value.max, value.avg, value.min].join(",");
					}
				}
			}
			else {
				row = ["index,date,value"];
				
				for (var i=0, _i=keys.length; i<_i; i++) {
					block = keys[i];
					
					for (var j=0, _j=block.length; j<_j; j++) {
						dateMills = block[j];
						date = new Date(dateMills);
						
						row[row.length] = [j, date.toISOString().slice(0, 10) + " "+ date.toTimeString().slice(0, 8), data[dateMills]].join(",");
					}
				}
			}
			
			return row.join("\n");
		}
	};
	
}) (window);