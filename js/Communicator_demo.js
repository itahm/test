;"use strict";

function Communicator() {
}

(function(window, undefined) {
	Communicator.prototype = {
		connect: function () {
		},
		
		close: function () {
		},
		
		send: send
	};
	
	function send(data, callback) {
		var command = data.command,
			database = data.database;
		
		if (command === "echo") {
			callback({}, this.session? 200: 401);
		}
		else if (command === "pull") {
			if (database === "device") {
				callback(deviceData, 200);
			}
			else if (database === "snmp") {
				callback(snmpData, 200);
			}
			else if (database === "profile") {
				callback({
					"public": {
						community: "public",
						version: "v2c",
						udp: 161
					}
				}, 200);
			}
			else if (database === "account") {
				callback({
					root: {
						username: "root",
						password: "root"
					}
				}, 200);
			}
			
		}
		else if (command === "signin") {
			this.session = true;
			
			callback({}, 200);
		}
	}
	
	var deviceData = {
	    "0": {
	        "address": "127.0.0.1",
	        "x": 27.279999999999916,
	        "name": "itahm",
	        "snmp": "public",
	        "y": 330.4400000000001,
	        "id": "0",
	        "type": "server",
	        "iFace": {}
	    },
	    "4": {
	        "address": "10.5.100.99",
	        "name": "2nd floor",
	        "x": 119.67999999999995,
	        "y": 262,
	        "id": "4",
	        "label": "",
	        "community": "",
	        "type": "l3switch",
	        "iFace": {
	            "eth1": "73",
	            "eth2": "5"
	        }
	    },
	    "5": {
	        "address": "1.2.3.47",
	        "name": "router",
	        "x": 244.24,
	        "y": 262,
	        "id": "5",
	        "community": "",
	        "type": "router",
	        "iFace": {
	            "e1/0": "4"
	        }
	    },
	    "10": {
	        "address": "192.168.0.250",
	        "x": -73.68,
	        "name": "server",
	        "y": 398.20000000000005,
	        "id": "10",
	        "type": "storage",
	        "community": "",
	        "iFace": {
	            "eth2": "62"
	        }
	    },
	    "11": {
	        "address": "8.8.8.88",
	        "x": -190.08000000000004,
	        "name": "web server",
	        "y": 340.5200000000001,
	        "id": "11",
	        "label": "",
	        "type": "server",
	        "community": "",
	        "iFace": {
	            "eth0": "62"
	        }
	    },
	    "15": {
	        "address": "192.168.100.100",
	        "name": "vpn main(A)",
	        "x": 227.24,
	        "y": -164.84000000000003,
	        "id": "15",
	        "type": "concentrator",
	        "iFace": {
	            "eth7": "47",
	            "eth8": "46"
	        }
	    },
	    "40": {
	        "address": "1.0.0.100",
	        "x": -147.76,
	        "name": "firewall(active)",
	        "y": -104.84000000000003,
	        "id": "40",
	        "type": "firewall",
	        "iFace": {
	            "eth1": "53",
	            "eth2": "46",
	            "eth3": "68",
	            "eth4": "69"
	        }
	    },
	    "41": {
	        "address": "10.0.0.200",
	        "x": 52.24000000000001,
	        "name": "firewall(standby)",
	        "y": -104.84000000000003,
	        "id": "41",
	        "type": "firewall",
	        "iFace": {
	            "eth1": "52",
	            "eth2": "47",
	            "eth3": "68",
	            "eth4": "69"
	        }
	    },
	    "46": {
	        "address": "172.16.0.10",
	        "x": -147.76,
	        "name": "internet router 1",
	        "y": -224.84000000000003,
	        "id": "46",
	        "label": "idc,public",
	        "type": "router",
	        "iFace": {
	            "g2/21": "40",
	            "g0/8": "80",
	            "g1/1": "47",
	            "g1/11": "15"
	        }
	    },
	    "47": {
	        "address": "172.16.0.20",
	        "x": 51.24000000000001,
	        "name": "internet router 2",
	        "y": -224.84000000000003,
	        "id": "47",
	        "label": "public,idc",
	        "type": "router",
	        "iFace": {
	            "g2/21": "41",
	            "g1/2": "46",
	            "g1/11": "15"
	        }
	    },
	    "52": {
	        "address": "",
	        "x": 52.24000000000001,
	        "name": "backbone switch",
	        "y": 20.160000000000025,
	        "id": "52",
	        "type": "l3switch",
	        "iFace": {
	            "g0/1": "41",
	            "g0/2": "58",
	            "g0/3": "73",
	            "g0/4": "74"
	        }
	    },
	    "53": {
	        "address": "",
	        "x": -147.76,
	        "name": "backbone switch",
	        "y": 20.160000000000025,
	        "id": "53",
	        "type": "l3switch",
	        "iFace": {
	            "g0/1": "40",
	            "g0/2": "58",
	            "g0/3": "73",
	            "g0/4": "74",
	            "g0/5": "57"
	        }
	    },
	    "57": {
	        "address": "",
	        "x": -260.48,
	        "name": "server farm (A)",
	        "y": 181.24,
	        "id": "57",
	        "type": "l3switch",
	        "iFace": {
	            "ge3": "53"
	        }
	    },
	    "58": {
	        "address": "",
	        "x": -88.92000000000004,
	        "name": "server farm (S)",
	        "y": 176.92,
	        "id": "58",
	        "type": "l3switch",
	        "iFace": {
	            "f0/2": "53",
	            "f0/3": "52"
	        }
	    },
	    "62": {
	        "address": "",
	        "x": -74.16000000000014,
	        "name": "workgroup 1",
	        "y": 270.80000000000007,
	        "id": "62",
	        "type": "workgroup",
	        "iFace": {
	            "fe24": "73",
	            "fe1": "11",
	            "fe23": "10"
	        }
	    },
	    "68": {
	        "address": "",
	        "x": 202.24,
	        "name": "dmz (A)",
	        "y": 33.160000000000025,
	        "id": "68",
	        "label": "idc,dmz",
	        "type": "l3switch",
	        "iFace": {
	            "g2/47": "40",
	            "g2/48": "41"
	        }
	    },
	    "69": {
	        "address": "",
	        "x": 280.24,
	        "name": "dmz (S)",
	        "y": -62.839999999999975,
	        "id": "69",
	        "type": "l3switch",
	        "iFace": {
	            "g2/47": "40",
	            "g2/48": "41"
	        }
	    },
	    "73": {
	        "address": "",
	        "x": 2.240000000000009,
	        "name": "user (A)",
	        "y": 175.16,
	        "id": "73",
	        "type": "l3switch",
	        "iFace": {
	            "g3/1": "53",
	            "g3/2": "52",
	            "f1/1": "62",
	            "f1/2": "4"
	        }
	    },
	    "74": {
	        "address": "",
	        "x": 217.24,
	        "name": "user (S)",
	        "y": 175.16,
	        "id": "74",
	        "type": "l3switch",
	        "iFace": {
	            "g2/1": "53",
	            "g2/2": "52"
	        }
	    },
	    "80": {
	        "address": "",
	        "x": -147.76,
	        "name": "isp KT",
	        "y": -344.84000000000003,
	        "id": "80",
	        "type": "cloud",
	        "iFace": {
	            "kt": "46"
	        }
	    }
	},
	snmpData = {
	    "127.0.0.1": {
	        "udp": 161,
	        "hrProcessorIndex": {
	            "5": 5,
	            "6": 6,
	            "7": 7,
	            "8": 8
	        },
	        "ifIndex": {
	            "22": 22,
	            "23": 23,
	            "24": 24,
	            "25": 25,
	            "26": 26,
	            "27": 27,
	            "28": 28,
	            "29": 29,
	            "30": 30,
	            "31": 31,
	            "10": 10,
	            "32": 32,
	            "11": 11,
	            "33": 33,
	            "12": 12,
	            "34": 34,
	            "13": 13,
	            "35": 35,
	            "14": 14,
	            "36": 36,
	            "15": 15,
	            "37": 37,
	            "16": 16,
	            "38": 38,
	            "17": 17,
	            "39": 39,
	            "18": 18,
	            "19": 19,
	            "1": 1,
	            "2": 2,
	            "3": 3,
	            "4": 4,
	            "5": 5,
	            "6": 6,
	            "7": 7,
	            "8": 8,
	            "9": 9,
	            "40": 40,
	            "41": 41,
	            "20": 20,
	            "21": 21
	        },
	        "hrStorageIndex": {
	            "1": 1,
	            "2": 2,
	            "3": 3,
	            "4": 4,
	            "5": 5
	        },
	        "hrProcessorLoad": {},
	        "ip": "127.0.0.1",
	        "profile": "public",
	        "sysObjectID": "1.3.6.1.4.1.311.1.1.3.1.1",
	        "ifEntry": {
	            "22": {
	                "ifAlias": "Reusable ISATAP Interface {1498C6E3-ADDF-4C29-AE28-CD266A0E2046}",
	                "ifAdminStatus": 1,
	                "ifIndex": 22,
	                "ifoutOctets": 0,
	                "ifType": 131,
	                "ifPhysAddress": "\u0000\u0000\u0000\u0000\u0000\u0000\u0000?",
	                "ifOutOctets": 0,
	                "ifName": "tunnel_4",
	                "ifSpeed": 100000,
	                "ifInOctets": 0,
	                "ifOperStatus": 2,
	                "ifDescr": "Microsoft ISATAP Adapter\u0000"
	            },
	            "23": {
	                "ifAlias": "Reusable ISATAP Interface {E3C50028-0DE4-45FD-9AD8-5CCEDA182379}",
	                "ifAdminStatus": 1,
	                "ifIndex": 23,
	                "ifoutOctets": 12,
	                "ifType": 131,
	                "ifPhysAddress": "\u0000\u0000\u0000\u0000\u0000\u0000\u0000?",
	                "ifOutOctets": 0,
	                "ifName": "tunnel_9",
	                "ifSpeed": 100000,
	                "ifInOctets": 0,
	                "ifOperStatus": 2,
	                "ifDescr": "Microsoft ISATAP Adapter #5\u0000"
	            },
	            "24": {
	                "ifAlias": "",
	                "ifAdminStatus": 1,
	                "ifIndex": 24,
	                "ifoutOctets": 0,
	                "ifType": 71,
	                "ifPhysAddress": "?*궎$-",
	                "ifOutOctets": 567,
	                "ifName": "wireless_1",
	                "ifSpeed": 99000000,
	                "ifInOctets": 324,
	                "ifOperStatus": 1,
	                "ifDescr": "Broadcom 802.11n Network Adapter-Native WiFi Filter Driver-0000\u0000"
	            },
	            "25": {
	                "ifAlias": "Reusable Microsoft 6To4 Adapter",
	                "ifAdminStatus": 1,
	                "ifIndex": 25,
	                "ifoutOctets": 0,
	                "ifType": 131,
	                "ifPhysAddress": "\u0000\u0000\u0000\u0000\u0000\u0000\u0000?",
	                "ifOutOctets": 0,
	                "ifName": "tunnel_10",
	                "ifSpeed": 30000000,
	                "ifInOctets": 0,
	                "ifOperStatus": 1,
	                "ifDescr": "Microsoft 6to4 Adapter\u0000"
	            },
	            "26": {
	                "ifAlias": "",
	                "ifAdminStatus": 1,
	                "ifIndex": 26,
	                "ifoutOctets": 0,
	                "ifType": 6,
	                "ifPhysAddress": "\u0000?@rY?",
	                "ifOutOctets": 0,
	                "ifName": "ethernet_2",
	                "ifSpeed": 4294967295,
	                "ifInOctets": 0,
	                "ifOperStatus": 2,
	                "ifDescr": "Juniper Network Connect Virtual Adapter-Ahnlab Light Weight Filter-0000\u0000"
	            },
	            "27": {
	                "ifAlias": "",
	                "ifAdminStatus": 1,
	                "ifIndex": 27,
	                "ifoutOctets": 0,
	                "ifType": 6,
	                "ifPhysAddress": "\u0000?@rY?",
	                "ifOutOctets": 0,
	                "ifName": "ethernet_3",
	                "ifSpeed": 4294967295,
	                "ifInOctets": 0,
	                "ifOperStatus": 2,
	                "ifDescr": "Juniper Network Connect Virtual Adapter-QoS Packet Scheduler-0000\u0000"
	            },
	            "28": {
	                "ifAlias": "",
	                "ifAdminStatus": 1,
	                "ifIndex": 28,
	                "ifoutOctets": 0,
	                "ifType": 6,
	                "ifPhysAddress": "\u0000?@rY?",
	                "ifOutOctets": 0,
	                "ifName": "ethernet_5",
	                "ifSpeed": 4294967295,
	                "ifInOctets": 0,
	                "ifOperStatus": 2,
	                "ifDescr": "Juniper Network Connect Virtual Adapter-WFP LightWeight Filter-0000\u0000"
	            },
	            "29": {
	                "ifAlias": "",
	                "ifAdminStatus": 1,
	                "ifIndex": 29,
	                "ifoutOctets": 0,
	                "ifType": 6,
	                "ifPhysAddress": "\u0000?@rY?",
	                "ifOutOctets": 0,
	                "ifName": "ethernet_7",
	                "ifSpeed": 4294967295,
	                "ifInOctets": 0,
	                "ifOperStatus": 2,
	                "ifDescr": "Juniper Network Connect Virtual Adapter-Virtual PC Network Filter Driver-0000\u0000"
	            },
	            "30": {
	                "ifAlias": "",
	                "ifAdminStatus": 1,
	                "ifIndex": 30,
	                "ifoutOctets": 12,
	                "ifType": 6,
	                "ifPhysAddress": "픝 RAS",
	                "ifOutOctets": 0,
	                "ifName": "ethernet_11",
	                "ifSpeed": 1073741824,
	                "ifInOctets": 0,
	                "ifOperStatus": 1,
	                "ifDescr": "WAN Miniport (Network Monitor)-QoS Packet Scheduler-0000\u0000"
	            },
	            "31": {
	                "ifAlias": "",
	                "ifAdminStatus": 1,
	                "ifIndex": 31,
	                "ifoutOctets": 12,
	                "ifType": 6,
	                "ifPhysAddress": "픝 RAS",
	                "ifOutOctets": 0,
	                "ifName": "ethernet_12",
	                "ifSpeed": 1073741824,
	                "ifInOctets": 0,
	                "ifOperStatus": 1,
	                "ifDescr": "WAN Miniport (IP)-QoS Packet Scheduler-0000\u0000"
	            },
	            "10": {
	                "ifAlias": "",
	                "ifAdminStatus": 2,
	                "ifIndex": 10,
	                "ifoutOctets": 0,
	                "ifType": 6,
	                "ifPhysAddress": "d1P\u000eD?",
	                "ifOutOctets": 0,
	                "ifName": "ethernet_6",
	                "ifSpeed": 0,
	                "ifInOctets": 0,
	                "ifOperStatus": 2,
	                "ifDescr": "Realtek RTL8168D/8111D Family PCI-E Gigabit Ethernet NIC(NDIS 6.20)\u0000"
	            },
	            "32": {
	                "ifAlias": "",
	                "ifIndex": 32,
	                "ifAdminStatus": 1,
	                "ifType": 6,
	                "ifPhysAddress": "픝 RAS",
	                "ifOutOctets": 0,
	                "ifName": "ethernet_13",
	                "ifSpeed": 1073741824,
	                "ifInOctets": 0,
	                "ifOperStatus": 1,
	                "ifDescr": "WAN Miniport (IPv6)-QoS Packet Scheduler-0000\u0000"
	            },
	            "11": {
	                "ifAlias": "Bluetooth ",
	                "ifAdminStatus": 2,
	                "ifIndex": 11,
	                "ifoutOctets": 0,
	                "ifType": 6,
	                "ifPhysAddress": "?*굱6?",
	                "ifOutOctets": 0,
	                "ifName": "ethernet_9",
	                "ifSpeed": 0,
	                "ifInOctets": 0,
	                "ifOperStatus": 6,
	                "ifDescr": "Bluetooth 장치(개인 영역 네트워크)\u0000"
	            },
	            "33": {
	                "ifAlias": "",
	                "ifIndex": 33,
	                "ifAdminStatus": 1,
	                "ifType": 71,
	                "ifPhysAddress": "?*궎$-",
	                "ifOutOctets": 567,
	                "ifName": "wireless_2",
	                "ifSpeed": 99000000,
	                "ifInOctets": 324,
	                "ifOperStatus": 1,
	                "ifDescr": "Broadcom 802.11n Network Adapter-Virtual PC Network Filter Driver-0000\u0000"
	            },
	            "12": {
	                "ifAlias": "",
	                "ifAdminStatus": 2,
	                "ifIndex": 12,
	                "ifoutOctets": 0,
	                "ifType": 1,
	                "ifPhysAddress": "",
	                "ifOutOctets": 0,
	                "ifName": "other_0",
	                "ifSpeed": 0,
	                "ifInOctets": 0,
	                "ifOperStatus": 6,
	                "ifDescr": "Bluetooth 장치(RFCOMM 프로토콜 TDI)\u0000"
	            },
	            "34": {
	                "ifAlias": "",
	                "ifIndex": 34,
	                "ifAdminStatus": 1,
	                "ifType": 71,
	                "ifPhysAddress": "?*궎$-",
	                "ifOutOctets": 567,
	                "ifName": "wireless_3",
	                "ifSpeed": 99000000,
	                "ifInOctets": 324,
	                "ifOperStatus": 1,
	                "ifDescr": "Broadcom 802.11n Network Adapter-Ahnlab Light Weight Filter-0000\u0000"
	            },
	            "13": {
	                "ifAlias": "Teredo Tunneling Pseudo-Interface",
	                "ifAdminStatus": 1,
	                "ifIndex": 13,
	                "ifoutOctets": 0,
	                "ifType": 131,
	                "ifPhysAddress": "\u0000\u0000\u0000\u0000\u0000\u0000\u0000?",
	                "ifOutOctets": 0,
	                "ifName": "tunnel_6",
	                "ifSpeed": 100000,
	                "ifInOctets": 0,
	                "ifOperStatus": 2,
	                "ifDescr": "Teredo Tunneling Pseudo-Interface\u0000"
	            },
	            "35": {
	                "ifAlias": "",
	                "ifAdminStatus": 1,
	                "ifType": 71,
	                "ifPhysAddress": "?*궎$-",
	                "ifOutOctets": 567,
	                "ifName": "wireless_4",
	                "ifSpeed": 99000000,
	                "ifInOctets": 324,
	                "ifOperStatus": 1,
	                "ifDescr": "Broadcom 802.11n Network Adapter-WFP LightWeight Filter-0000\u0000"
	            },
	            "14": {
	                "ifAlias": "",
	                "ifAdminStatus": 1,
	                "ifIndex": 14,
	                "ifoutOctets": 12,
	                "ifType": 71,
	                "ifPhysAddress": "?*궎$-",
	                "ifOutOctets": 567,
	                "ifName": "wireless_0",
	                "ifSpeed": 99000000,
	                "ifInOctets": 324,
	                "ifOperStatus": 1,
	                "ifDescr": "Broadcom 802.11n Network Adapter\u0000"
	            },
	            "36": {
	                "ifAlias": "",
	                "ifAdminStatus": 1,
	                "ifType": 71,
	                "ifPhysAddress": "?*궎$-",
	                "ifOutOctets": 567,
	                "ifName": "wireless_6",
	                "ifSpeed": 99000000,
	                "ifInOctets": 324,
	                "ifOperStatus": 1,
	                "ifDescr": "Broadcom 802.11n Network Adapter-Virtual WiFi Filter Driver-0000\u0000"
	            },
	            "15": {
	                "ifAlias": "",
	                "ifAdminStatus": 1,
	                "ifIndex": 15,
	                "ifoutOctets": 0,
	                "ifType": 131,
	                "ifPhysAddress": "\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
	                "ifOutOctets": 0,
	                "ifName": "tunnel_1",
	                "ifSpeed": 0,
	                "ifInOctets": 0,
	                "ifOperStatus": 2,
	                "ifDescr": "WAN Miniport (IKEv2)\u0000"
	            },
	            "37": {
	                "ifAlias": "",
	                "ifAdminStatus": 1,
	                "ifType": 71,
	                "ifPhysAddress": "?*궎$-",
	                "ifOutOctets": 0,
	                "ifName": "wireless_7",
	                "ifSpeed": 0,
	                "ifInOctets": 0,
	                "ifOperStatus": 2,
	                "ifDescr": "Microsoft Virtual WiFi Miniport Adapter-Native WiFi Filter Driver-0000\u0000"
	            },
	            "16": {
	                "ifAlias": "",
	                "ifAdminStatus": 2,
	                "ifIndex": 16,
	                "ifoutOctets": 0,
	                "ifType": 6,
	                "ifPhysAddress": "???(U",
	                "ifOutOctets": 0,
	                "ifName": "ethernet_8",
	                "ifSpeed": 0,
	                "ifInOctets": 0,
	                "ifOperStatus": 6,
	                "ifDescr": "Apple Mobile Device Ethernet\u0000"
	            },
	            "38": {
	                "ifAlias": "",
	                "ifAdminStatus": 1,
	                "ifType": 71,
	                "ifPhysAddress": "?*궎$-",
	                "ifOutOctets": 0,
	                "ifName": "wireless_8",
	                "ifSpeed": 0,
	                "ifInOctets": 0,
	                "ifOperStatus": 2,
	                "ifDescr": "Microsoft Virtual WiFi Miniport Adapter-Virtual PC Network Filter Driver-0000\u0000"
	            },
	            "17": {
	                "ifAlias": "",
	                "ifAdminStatus": 1,
	                "ifIndex": 17,
	                "ifoutOctets": 0,
	                "ifType": 71,
	                "ifPhysAddress": "?*궎$-",
	                "ifOutOctets": 0,
	                "ifName": "wireless_5",
	                "ifSpeed": 0,
	                "ifInOctets": 0,
	                "ifOperStatus": 2,
	                "ifDescr": "Microsoft Virtual WiFi Miniport Adapter\u0000"
	            },
	            "39": {
	                "ifAlias": "",
	                "ifAdminStatus": 1,
	                "ifType": 71,
	                "ifPhysAddress": "?*궎$-",
	                "ifOutOctets": 0,
	                "ifName": "wireless_9",
	                "ifSpeed": 0,
	                "ifInOctets": 0,
	                "ifOperStatus": 2,
	                "ifDescr": "Microsoft Virtual WiFi Miniport Adapter-Ahnlab Light Weight Filter-0000\u0000"
	            },
	            "18": {
	                "ifAlias": "",
	                "ifAdminStatus": 1,
	                "ifIndex": 18,
	                "ifoutOctets": 0,
	                "ifType": 6,
	                "ifPhysAddress": "\u0000?@rY?",
	                "ifOutOctets": 0,
	                "ifName": "ethernet_10",
	                "ifSpeed": 4294967295,
	                "ifInOctets": 0,
	                "ifOperStatus": 2,
	                "ifDescr": "Juniper Network Connect Virtual Adapter\u0000"
	            },
	            "19": {
	                "ifAlias": "isatap.{BCDC41C8-AEBA-4775-B5EC-CF8AEDD0ABD7}",
	                "ifAdminStatus": 1,
	                "ifIndex": 19,
	                "ifoutOctets": 0,
	                "ifType": 131,
	                "ifPhysAddress": "\u0000\u0000\u0000\u0000\u0000\u0000\u0000?",
	                "ifOutOctets": 0,
	                "ifName": "tunnel_5",
	                "ifSpeed": 30000000,
	                "ifInOctets": 0,
	                "ifOperStatus": 1,
	                "ifDescr": "Microsoft ISATAP Adapter #2\u0000"
	            },
	            "1": {
	                "ifAlias": "Loopback Pseudo-Interface 1",
	                "ifAdminStatus": 1,
	                "ifIndex": 1,
	                "ifoutOctets": 0,
	                "ifType": 24,
	                "ifPhysAddress": "",
	                "ifOutOctets": 0,
	                "ifName": "loopback_0",
	                "ifSpeed": 1073741824,
	                "ifInOctets": 0,
	                "ifOperStatus": 1,
	                "ifDescr": "Software Loopback Interface 1\u0000"
	            },
	            "2": {
	                "ifAlias": "",
	                "ifAdminStatus": 1,
	                "ifIndex": 2,
	                "ifoutOctets": 0,
	                "ifType": 131,
	                "ifPhysAddress": "",
	                "ifOutOctets": 0,
	                "ifName": "tunnel_0",
	                "ifSpeed": 1073741824,
	                "ifInOctets": 0,
	                "ifOperStatus": 1,
	                "ifDescr": "WAN Miniport (SSTP)\u0000"
	            },
	            "3": {
	                "ifAlias": "",
	                "ifAdminStatus": 1,
	                "ifIndex": 3,
	                "ifoutOctets": 0,
	                "ifType": 131,
	                "ifPhysAddress": "",
	                "ifOutOctets": 0,
	                "ifName": "tunnel_2",
	                "ifSpeed": 1073741824,
	                "ifInOctets": 0,
	                "ifOperStatus": 1,
	                "ifDescr": "WAN Miniport (L2TP)\u0000"
	            },
	            "4": {
	                "ifAlias": "",
	                "ifAdminStatus": 1,
	                "ifIndex": 4,
	                "ifoutOctets": 0,
	                "ifType": 131,
	                "ifPhysAddress": "",
	                "ifOutOctets": 0,
	                "ifName": "tunnel_3",
	                "ifSpeed": 1073741824,
	                "ifInOctets": 0,
	                "ifOperStatus": 1,
	                "ifDescr": "WAN Miniport (PPTP)\u0000"
	            },
	            "5": {
	                "ifAlias": "",
	                "ifAdminStatus": 1,
	                "ifIndex": 5,
	                "ifoutOctets": 0,
	                "ifType": 23,
	                "ifPhysAddress": "",
	                "ifOutOctets": 0,
	                "ifName": "ppp_0",
	                "ifSpeed": 1073741824,
	                "ifInOctets": 0,
	                "ifOperStatus": 1,
	                "ifDescr": "WAN Miniport (PPPOE)\u0000"
	            },
	            "6": {
	                "ifAlias": "",
	                "ifAdminStatus": 1,
	                "ifIndex": 6,
	                "ifoutOctets": 0,
	                "ifType": 6,
	                "ifPhysAddress": "픝 RAS",
	                "ifOutOctets": 0,
	                "ifName": "ethernet_0",
	                "ifSpeed": 1073741824,
	                "ifInOctets": 0,
	                "ifOperStatus": 1,
	                "ifDescr": "WAN Miniport (IPv6)\u0000"
	            },
	            "7": {
	                "ifAlias": "",
	                "ifAdminStatus": 1,
	                "ifIndex": 7,
	                "ifoutOctets": 0,
	                "ifType": 6,
	                "ifPhysAddress": "픝 RAS",
	                "ifOutOctets": 0,
	                "ifName": "ethernet_1",
	                "ifSpeed": 1073741824,
	                "ifInOctets": 0,
	                "ifOperStatus": 1,
	                "ifDescr": "WAN Miniport (Network Monitor)\u0000"
	            },
	            "8": {
	                "ifAlias": "",
	                "ifAdminStatus": 1,
	                "ifIndex": 8,
	                "ifoutOctets": 0,
	                "ifType": 6,
	                "ifPhysAddress": "픝 RAS",
	                "ifOutOctets": 0,
	                "ifName": "ethernet_4",
	                "ifSpeed": 1073741824,
	                "ifInOctets": 0,
	                "ifOperStatus": 1,
	                "ifDescr": "WAN Miniport (IP)\u0000"
	            },
	            "9": {
	                "ifAlias": "",
	                "ifAdminStatus": 1,
	                "ifIndex": 9,
	                "ifoutOctets": 0,
	                "ifType": 23,
	                "ifPhysAddress": " ASYN?",
	                "ifOutOctets": 0,
	                "ifName": "ppp_1",
	                "ifSpeed": 1073741824,
	                "ifInOctets": 0,
	                "ifOperStatus": 2,
	                "ifDescr": "RAS Async Adapter\u0000"
	            },
	            "40": {
	                "ifAlias": "",
	                "ifAdminStatus": 1,
	                "ifType": 71,
	                "ifPhysAddress": "?*궎$-",
	                "ifOutOctets": 0,
	                "ifName": "wireless_10",
	                "ifSpeed": 0,
	                "ifInOctets": 0,
	                "ifOperStatus": 2,
	                "ifDescr": "Microsoft Virtual WiFi Miniport Adapter-QoS Packet Scheduler-0000\u0000"
	            },
	            "41": {
	                "ifAlias": "",
	                "ifAdminStatus": 1,
	                "ifType": 71,
	                "ifPhysAddress": "?*궎$-",
	                "ifOutOctets": 0,
	                "ifName": "wireless_11",
	                "ifSpeed": 0,
	                "ifInOctets": 0,
	                "ifOperStatus": 2,
	                "ifDescr": "Microsoft Virtual WiFi Miniport Adapter-WFP LightWeight Filter-0000\u0000"
	            },
	            "20": {
	                "ifAlias": "isatap.{1CA8AC2D-4940-470A-A200-4D2FD7247274}",
	                "ifAdminStatus": 1,
	                "ifIndex": 20,
	                "ifoutOctets": 0,
	                "ifType": 131,
	                "ifPhysAddress": "\u0000\u0000\u0000\u0000\u0000\u0000\u0000?",
	                "ifOutOctets": 0,
	                "ifName": "tunnel_7",
	                "ifSpeed": 100000,
	                "ifInOctets": 0,
	                "ifOperStatus": 2,
	                "ifDescr": "Microsoft ISATAP Adapter #3\u0000"
	            },
	            "42": {
	                "ifAlias": "",
	                "ifAdminStatus": 1,
	                "ifType": 71,
	                "ifPhysAddress": "?*궎$-",
	                "ifOutOctets": 0,
	                "ifName": "wireless_11",
	                "ifSpeed": 0,
	                "ifInOctets": 0,
	                "ifOperStatus": 2,
	                "ifDescr": "Microsoft Virtual WiFi Miniport Adapter-WFP LightWeight Filter-0000\u0000"
	            },
	            "21": {
	                "ifAlias": "isatap.{11CC7809-D562-4EF6-9B6C-0176541672E4}",
	                "ifAdminStatus": 1,
	                "ifIndex": 21,
	                "ifoutOctets": 0,
	                "ifType": 131,
	                "ifPhysAddress": "\u0000\u0000\u0000\u0000\u0000\u0000\u0000?",
	                "ifOutOctets": 0,
	                "ifName": "tunnel_8",
	                "ifSpeed": 100000,
	                "ifInOctets": 0,
	                "ifOperStatus": 2,
	                "ifDescr": "Microsoft ISATAP Adapter #4\u0000"
	            }
	        },
	        "hrStorageEntry": {
	            "1": {
	                "hrStorageUsed": 0,
	                "hrStorageAllocationUnits": 4096,
	                "hrStorageType": 4,
	                "hrStorageDescr": "C:\\ Label:  Serial Number 38f144e0",
	                "hrStorageSize": 31232511
	            },
	            "2": {
	                "hrStorageUsed": 0,
	                "hrStorageAllocationUnits": 0,
	                "hrStorageType": 7,
	                "hrStorageDescr": "D:\\",
	                "hrStorageSize": 0
	            },
	            "3": {
	                "hrStorageUsed": 0,
	                "hrStorageAllocationUnits": 0,
	                "hrStorageType": 5,
	                "hrStorageDescr": "F:\\",
	                "hrStorageSize": 0
	            },
	            "4": {
	                "hrStorageUsed": 0,
	                "hrStorageAllocationUnits": 65536,
	                "hrStorageType": 3,
	                "hrStorageDescr": "Virtual Memory",
	                "hrStorageSize": 95698
	            },
	            "5": {
	                "hrStorageUsed": 0,
	                "hrStorageAllocationUnits": 65536,
	                "hrStorageType": 2,
	                "hrStorageDescr": "Physical Memory",
	                "hrStorageSize": 47862
	            },
	            "6": {
	                "hrStorageUsed": 0,
	                "hrStorageAllocationUnits": 65536,
	                "hrStorageType": 2,
	                "hrStorageDescr": "Physical Memory",
	                "hrStorageSize": 47862
	            },
	            "7": {
	                "hrStorageUsed": 0,
	                "hrStorageAllocationUnits": 65536,
	                "hrStorageType": 2,
	                "hrStorageDescr": "Physical Memory",
	                "hrStorageSize": 47862
	            }
	        },
	        "community": "public",
	        "timeout": -1,
	        "hrSystemUptime": 2727993070,
	        "sysDescr": "Hardware: x86 Family 6 Model 37 Stepping 5 AT/AT COMPATIBLE - Software: Windows Version 6.1 (Build 7601 Multiprocessor Free)",
	        "delay": 370,
	        "sysName": "NETRMS_COM",
	        "hrProcessorEntry": {
	            "4": 3,
	            "5": 13,
	            "6": 4,
	            "7": 13,
	            "8": 5
	        },
	        "lastResponse": 1445935080784
	    }
	};
	
}) (window, undefined);