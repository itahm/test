var demoData = demoData || {};

demoData.device = {
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
        "snmp": true,
        "x": 119.67999999999995,
        "y": 262,
        "id": "4",
        "label": "",
        "community": "",
        "type": "layer4 switch",
        "ifEntry": {
        	"73": "eth1",
        	"5": "eth2" 
        },
        "shutdown": true
    },
    "5": {
        "ip": "1.2.3.47",
        "name": "router",
        "snmp": true,
        "x": 244.24,
        "y": 262,
        "id": "5",
        "community": "",
        "type": "router",
        "ifEntry": {
        	"4": "e1/0" 
        }
    },
    "10": {
        "ip": "192.168.0.250",
        "x": -73.68,
        "name": "server",
        "snmp": true,
        "y": 398.20000000000005,
        "id": "10",
        "type": "storage",
        "community": "",
        "ifEntry": {
            "62": "eth2"
        }
    },
    "11": {
        "ip": "8.8.8.88",
        "x": -190.08000000000004,
        "name": "web server",
        "snmp": true,
        "y": 340.5200000000001,
        "id": "11",
        "label": "",
        "type": "server",
        "community": "",
        "ifEntry": {
        	"62": "eth0" 
        },
    	"shutdown": true
    },
    "15": {
        "ip": "192.168.100.100",
        "name": "vpn main(A)",
        "snmp": true,
        "x": 227.24,
        "y": -164.84000000000003,
        "id": "15",
        "type": "vpn concentrator",
        "ifEntry": {
        	"47": "eth7",
            "46": "eth8"
        }
    },
    "40": {
        "ip": "1.0.0.100",
        "x": -147.76,
        "name": "firewall(active)",
        "snmp": true,
        "y": -104.84000000000003,
        "id": "40",
        "type": "firewall",
        "ifEntry": {
        	"53": "eth1",
        	"46": "eth2",
        	"68": "eth3",
        	"69": "eth4" 
        }
    },
    "41": {
        "ip": "10.0.0.200",
        "x": 52.24000000000001,
        "name": "firewall(standby)",
        "snmp": true,
        "y": -104.84000000000003,
        "id": "41",
        "type": "firewall",
        "ifEntry": {
        	"52": "eth1",
        	"47": "eth2",
        	"68": "eth3",
        	"69": "eth4" 
        }
    },
    "46": {
        "ip": "172.16.0.10",
        "x": -147.76,
        "name": "internet router 1",
        "snmp": true,
        "y": -224.84000000000003,
        "id": "46",
        "label": "idc,public",
        "type": "router",
        "ifEntry": {
        	"40": "g2/21",
        	"80": "g0/8",
        	"47": "g1/1",
        	"15": "g1/11"
        }
    },
    "47": {
        "ip": "172.16.0.20",
        "x": 51.24000000000001,
        "name": "internet router 2",
        "snmp": true,
        "y": -224.84000000000003,
        "id": "47",
        "label": "public,idc",
        "type": "router",
        "ifEntry": {
        	"41": "g2/21",
        	"46": "g1/2",
        	"15": "g1/11" 
        }
    },
    "52": {
        "ip": "172.16.0.30",
        "x": 52.24000000000001,
        "name": "backbone switch",
        "snmp": true,
        "y": 20.160000000000025,
        "id": "52",
        "type": "layer3 switch",
        "ifEntry": {
        	"41": "g0/1",
        	"58": "g0/2",
        	"73": "g0/3",
        	"74": "g0/4" 
        }
    },
    "53": {
        "ip": "10.10.99.8",
        "x": -147.76,
        "name": "backbone switch",
        "snmp": true,
        "y": 20.160000000000025,
        "id": "53",
        "type": "layer3 switch",
        "ifEntry": {
        	"40": "g0/1",
        	"58": "g0/2",
        	"73": "g0/3",
        	"74": "g0/4",
        	"57": "g0/5" 
        }
    },
    "57": {
        "ip": "10.20.20.254",
        "x": -260.48,
        "name": "server farm (A)",
        "snmp": true,
        "y": 181.24,
        "id": "57",
        "type": "layer3 switch",
        "ifEntry": {
        	"53": "ge3" 
        }
    },
    "58": {
        "ip": "192.168.254.10",
        "x": -88.92000000000004,
        "name": "server farm (S)",
        "snmp": true,
        "y": 176.92,
        "id": "58",
        "type": "layer3 switch",
        "ifEntry": {
        	"53": "f0/2",
        	"52": "f0/3" 
        }
    },
    "62": {
        "ip": "172.16.30.200",
        "x": -74.16000000000014,
        "name": "workgroup 1",
        "snmp": true,
        "y": 270.80000000000007,
        "id": "62",
        "type": "workgroup switch",
        "ifEntry": {
        	"73": "fe24",
        	"11": "fe1",
        	"10": "fe23" 
        }
    },
    "68": {
        "ip": "10.6.188.7",
        "x": 202.24,
        "name": "dmz (A)",
        "snmp": true,
        "y": 33.160000000000025,
        "id": "68",
        "label": "idc,dmz",
        "type": "layer3 switch",
        "ifEntry": {
        	"40": "g2/47",
        	"41": "g2/48" 
        }
    },
    "69": {
        "ip": "10.50.50.5",
        "x": 280.24,
        "name": "dmz (S)",
        "snmp": true,
        "y": -62.839999999999975,
        "id": "69",
        "type": "layer3 switch",
        "ifEntry": {
        	"40": "g2/47",
        	"41": "g2/48" 
        }
    },
    "73": {
        "ip": "100.3.64.78",
        "x": 2.240000000000009,
        "name": "user (A)",
        "snmp": true,
        "y": 175.16,
        "id": "73",
        "type": "layer3 switch",
        "ifEntry": {
        	"53": "g3/1",
        	"52": "g3/2",
        	"62": "f1/1",
        	"4": "f1/2" 
        }
    },
    "74": {
        "ip": "1.1.1.1",
        "x": 217.24,
        "snmp": true,
        "name": "user (S)",
        "snmp": true,
        "y": 175.16,
        "id": "74",
        "type": "layer3 switch",
        "ifEntry": {
        	"53": "g2/1",
        	"52": "g2/2" 
        }
    },
    "80": {
        "ip": "99.99.99.99",
        "x": -147.76,
        "snmp": true,
        "name": "isp KT",
        "y": -344.84000000000003,
        "id": "80",
        "type": "cloud",
        "ifEntry": {
        	"46": "kt" 
        }
    }
};
