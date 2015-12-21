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
			if (url) {
				xhr = new XMLHttpRequest();
			}
			else {
				throw "closed.";
			}
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
		if (data.database === "device") {
			callback(deviceData, 200);
			
			return;
		}
		
		if (callbackQ.length == 0) {
			send(data, background);
		}
		else {
			dataQ.push(data);
		}
		
		callbackQ.push(callback);
	};
}

var deviceData = {
    "0": {
        "ip": "127.0.0.1",
        "x": 27.279999999999916,
        "name": "itahm",
        "snmp": true,
        "profile": "public",
        "y": 330.4400000000001,
        "id": "0",
        "type": "server",
        "ifEntry": {}
    },
    "4": {
        "ip": "10.5.100.99",
        "name": "2nd floor",
        "x": 119.67999999999995,
        "y": 262,
        "id": "4",
        "label": "",
        "community": "",
        "type": "l4switch",
        "ifEntry": {
            "eth1": "73",
            "eth2": "5"
        }
    },
    "5": {
        "ip": "1.2.3.47",
        "name": "router",
        "x": 244.24,
        "y": 262,
        "id": "5",
        "community": "",
        "type": "router",
        "ifEntry": {
            "e1/0": "4"
        }
    },
    "10": {
        "ip": "192.168.0.250",
        "x": -73.68,
        "name": "server",
        "y": 398.20000000000005,
        "id": "10",
        "type": "storage",
        "community": "",
        "ifEntry": {
            "eth2": "62"
        }
    },
    "11": {
        "ip": "8.8.8.88",
        "x": -190.08000000000004,
        "name": "web server",
        "y": 340.5200000000001,
        "id": "11",
        "label": "",
        "type": "server",
        "community": "",
        "ifEntry": {
            "eth0": "62"
        }
    },
    "15": {
        "ip": "192.168.100.100",
        "name": "vpn main(A)",
        "x": 227.24,
        "y": -164.84000000000003,
        "id": "15",
        "type": "concentrator",
        "ifEntry": {
            "eth7": "47",
            "eth8": "46"
        }
    },
    "40": {
        "ip": "1.0.0.100",
        "x": -147.76,
        "name": "firewall(active)",
        "y": -104.84000000000003,
        "id": "40",
        "type": "firewall",
        "ifEntry": {
            "eth1": "53",
            "eth2": "46",
            "eth3": "68",
            "eth4": "69"
        }
    },
    "41": {
        "ip": "10.0.0.200",
        "x": 52.24000000000001,
        "name": "firewall(standby)",
        "y": -104.84000000000003,
        "id": "41",
        "type": "firewall",
        "ifEntry": {
            "eth1": "52",
            "eth2": "47",
            "eth3": "68",
            "eth4": "69"
        }
    },
    "46": {
        "ip": "172.16.0.10",
        "x": -147.76,
        "name": "internet router 1",
        "y": -224.84000000000003,
        "id": "46",
        "label": "idc,public",
        "type": "router",
        "ifEntry": {
            "g2/21": "40",
            "g0/8": "80",
            "g1/1": "47",
            "g1/11": "15"
        }
    },
    "47": {
        "ip": "172.16.0.20",
        "x": 51.24000000000001,
        "name": "internet router 2",
        "y": -224.84000000000003,
        "id": "47",
        "label": "public,idc",
        "type": "router",
        "ifEntry": {
            "g2/21": "41",
            "g1/2": "46",
            "g1/11": "15"
        }
    },
    "52": {
        "ip": "",
        "x": 52.24000000000001,
        "name": "backbone switch",
        "y": 20.160000000000025,
        "id": "52",
        "type": "l3switch",
        "ifEntry": {
            "g0/1": "41",
            "g0/2": "58",
            "g0/3": "73",
            "g0/4": "74"
        }
    },
    "53": {
        "ip": "",
        "x": -147.76,
        "name": "backbone switch",
        "y": 20.160000000000025,
        "id": "53",
        "type": "l3switch",
        "ifEntry": {
            "g0/1": "40",
            "g0/2": "58",
            "g0/3": "73",
            "g0/4": "74",
            "g0/5": "57"
        }
    },
    "57": {
        "ip": "",
        "x": -260.48,
        "name": "server farm (A)",
        "y": 181.24,
        "id": "57",
        "type": "l3switch",
        "ifEntry": {
            "ge3": "53"
        }
    },
    "58": {
        "ip": "",
        "x": -88.92000000000004,
        "name": "server farm (S)",
        "y": 176.92,
        "id": "58",
        "type": "l3switch",
        "ifEntry": {
            "f0/2": "53",
            "f0/3": "52"
        }
    },
    "62": {
        "ip": "",
        "x": -74.16000000000014,
        "name": "workgroup 1",
        "y": 270.80000000000007,
        "id": "62",
        "type": "workgroup",
        "ifEntry": {
            "fe24": "73",
            "fe1": "11",
            "fe23": "10"
        }
    },
    "68": {
        "ip": "",
        "x": 202.24,
        "name": "dmz (A)",
        "y": 33.160000000000025,
        "id": "68",
        "label": "idc,dmz",
        "type": "l3switch",
        "ifEntry": {
            "g2/47": "40",
            "g2/48": "41"
        }
    },
    "69": {
        "ip": "",
        "x": 280.24,
        "name": "dmz (S)",
        "y": -62.839999999999975,
        "id": "69",
        "type": "l3switch",
        "ifEntry": {
            "g2/47": "40",
            "g2/48": "41"
        }
    },
    "73": {
        "ip": "",
        "x": 2.240000000000009,
        "name": "user (A)",
        "y": 175.16,
        "id": "73",
        "type": "l3switch",
        "ifEntry": {
            "g3/1": "53",
            "g3/2": "52",
            "f1/1": "62",
            "f1/2": "4"
        }
    },
    "74": {
        "ip": "",
        "x": 217.24,
        "name": "user (S)",
        "y": 175.16,
        "id": "74",
        "type": "l3switch",
        "ifEntry": {
            "g2/1": "53",
            "g2/2": "52"
        }
    },
    "80": {
        "ip": "",
        "x": -147.76,
        "name": "isp KT",
        "y": -344.84000000000003,
        "id": "80",
        "type": "cloud",
        "ifEntry": {
            "kt": "46"
        }
    }
};