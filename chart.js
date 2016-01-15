function Path(container) {
	this.initialize(container);
}

(function (window, undefined) {
	var svgNS = "http://www.w3.org/2000/svg";
	
	Path.prototype = {
		initialize: function (container) {
			this.container = container;
			this.path = document.createElementNS(svgNS, "path");
			
			container.appendChild(this.path);
			
			this.beginPath();
		},
		
		moveTo: function (x, y) {
			this.distance[this.distance.length] = "M"+ x +" "+ y;
			
			return this;
		},
		
		lineTo: function (x, y) {
			this.distance[this.distance.length] = "L"+ x +" "+ y;
			
			return this;
		},
		
		stroke: function () {
			this.path.setAttributeNS(null, "d", this.distance.join(" "));
			this.path.setAttributeNS(null, "stroke", this.strokeStyle || "#000000");
		},
		
		fill: function () {
			this.path.setAttributeNS(null, "d", this.distance.join(" "));
			this.path.setAttributeNS(null, "fill", this.fillStyle || "#000000");
		},
		
		beginPath: function () {
			this.distance = [];
		},
		
		closePath: function () {
			this.distance[this.distance.length] = "Z"
		}
	};
	
}) (window);

function Chart(id) {
	this.initialize(id);
}

(function (window, undefined) {
	var svgNS = "http://www.w3.org/2000/svg",
		MIN_CHART_WIDTH = 100,
		MIN_CHART_HEIGHT = 100,
		MIN_AXIS_VSPACE = 50,
		MIN_AXIS_HSPACE = 160,
		MAX_AXIS_VAL_CNT = 10,
		DATE_AXIS_HEIGHT = 50,
		MARGIN = 20,
		PADDING = 5,
		WHEEL_REPEAT = 50,
		HOUR24 = 24 * 60 * 60 * 1000,
		uuid = 1;

	function valueToString(value) {
		return value;
	}
	
	function onResize(chart, e) {
		clearTimeout(chart.resizeTimer);
		
		chart.resizeTimer = setTimeout(chart.resize.bind(chart), 300);
	}
	
	function onWheel(chart, e) {
		clearTimeout(chart.wheelTimer);
		
		chart.wheelTimer = setTimeout(chart.zoom.bind(chart, e.deltaY < 0), 100);
	}
	
	function onDragStart(chart, e) {
		chart.dragStart = chart.start;
		chart.dragEnd = chart.end;
	}
	
	function onDragMove(chart, e) {
		chart.move(e.detail.dragX);
	}
	
	Chart.prototype = {
		initialize: function (id) {
			var root = document.getElementById(id);
			
			this.svgChart = document.createElementNS(svgNS, "svg");
			this.container = document.createElementNS(svgNS, "g");
			this.rect = {};
			this.clipPath = document.createElementNS(svgNS, "clipPath");
			this.clipRect = document.createElementNS(svgNS, "rect");
			this.leftAxis = new LeftAxis(this);
			this.rightAxis = new RightAxis(this);
			this.dateAxis = new DateAxis(this);
			
			// graph 가 clippath의 id를 참조하므로 반드시 graph 생성 전에 생성해야함
			this.clipPath.setAttributeNS(null, "id", id +"_clip_"+ uuid++);
			
			this.graph = new Graph(this);
			this.grid = new Path(this.container);
			this.data = new ChartSummaryData(createData());
			this.start = new Date(2015, 10, 10, 0, 0, 0, 0).getTime();
			this.end = new Date(2015, 10, 11, 0, 0, 0, 0).getTime();
			
			//this.grid.strokeStyle = "#dddddd";
			
			this.container.setAttribute("transform", "translate(20, 20)");
			
			this.svgChart.appendChild(document.createElementNS(svgNS, "defs"))
			.appendChild(this.clipPath);
			
			this.clipPath.appendChild(this.clipRect);
			
			var transformList = this.container.transform.baseVal;
			
			this.transform = {
				translate: transformList.getItem(0)
			};
						
			root.appendChild(this.svgChart).appendChild(this.container);
			
			document.body.addEventListener("selectstart", function (e) {
				e.preventDefault();
			});
			
			window.addEventListener("resize", onResize.bind(undefined, this));
			this.svgChart.addEventListener("wheel", onWheel.bind(undefined, this));
			new Draggable(this.svgChart);
			
			this.svgChart.addEventListener("dragstart", onDragStart.bind(undefined, this));
			this.svgChart.addEventListener("dragmove", onDragMove.bind(undefined, this));
			
			this.resize();
		},
		
		getClipID: function () {
			return this.clipPath.getAttributeNS(null, "id");
		},
		
		invalidate: function () {
			var data = this.data.buildData(this.start, this.end),
				width = this.rect.width,
				height = this.rect.height;
			
			// TODO invalidate라고 항상 data build 하고 tpp 다시 계산 하고 해야 하는가? invalidate는 언제 발생하는가?
			this.tpp = (this.end - this.start) / width;
			
			this.high = data.high;
			this.low = data.low;;
			
			this.drawAxis();
			
			this.drawDate();
			
			this.drawGraph(data);
		},
		
		resize: function () {
			var rect = this.svgChart.getBoundingClientRect(),
				width = rect.width - MARGIN *2,
				height = rect.height - MARGIN *2 - DATE_AXIS_HEIGHT;
			
			//window resize 발생 했으나 chart 크기 변화는 없음
			if (width === this.rect.width && height === this.rect.height) {
				return;
			}
			
			this.rect.width = width;
			this.rect.height = height;
			
			this.invalidate();
		},
		
		move: function (drag) {
			drag *= this.tpp;
			//if (drag % 5 === 0) {
				this.start = this.dragStart - drag;
				this.end = this.dragEnd - drag;
				
				this.invalidate();
			//}
		},
		
		zoom: function (zoomIn) {
			var sign = zoomIn? 1: -1;
			
			for (var i=0; i<WHEEL_REPEAT; i++) {
				this.end -= this.tpp * sign;
				this.start += this.tpp * sign;
			}
			
			this.invalidate();
		},
		
		drawGrid: function (x1, x2, count, space) {
			this.grid.beginPath();
			
			for (var i=0, y; i<=count; i++) {
				y = i * space -.5;
				
				this.grid.moveTo(x1, y).lineTo(x2, y);
			}
			
			this.grid.stroke();
		},
		
		drawAxis: function () {
			var height = this.rect.height,
				count = Math.min(MAX_AXIS_VAL_CNT, Math.round(height / MIN_AXIS_VSPACE)),
				grow = (this.high - this.low) / count,
				valueArray = [],
				x1, x2;
			
			for (var i=0; i<=count; i++) {
				valueArray[valueArray.length] = this.high - i * grow;
			}
			
			this.leftAxis.draw(valueArray, height / count, this.high);
			x1 = this.leftAxis.getSize().width;
			this.leftAxis.setTranslate(x1, 0);
			
			this.rightAxis.draw(valueArray, height / count, this.high);
			x2 = this.rect.width - this.rightAxis.getSize().width;
			this.rightAxis.setTranslate(x2, 0);
			
			this.drawGrid(x1, x2, count, height / count);
			
			this.clipRect.setAttributeNS(null, "x", x1 + PADDING);
			this.clipRect.setAttributeNS(null, "y", 0);
			this.clipRect.setAttributeNS(null, "width", x2 - x1 - PADDING *2);
			this.clipRect.setAttributeNS(null, "height", height);
		},
		
		drawDate: function () {
			var height = this.rect.height,
				width = this.rect.width,
				valueArray = [],
				date = new Date(this.start),
				end = new Date(this.end),
				limit = this.tpp * MIN_AXIS_HSPACE,
				offset, space, mills, lastMills;
			
			this.dateAxis.setTranslate(0, height + PADDING);
			
			if (this.tpp > 120000) {
				// 날짜 단위 표시
				lastMills = date.setHours(0, 0, 0, 0);
				
				while (date < end) {
					mills = date.setDate(date.getDate() + 1);
					
					if (mills - lastMills > limit) {
						valueArray[valueArray.length] = mills;
						
						lastMills = mills;
					}
					else {
					}
				}
				
				if (valueArray.length > 0) {
					offset = (valueArray[0] - this.start) / this.tpp;
					
					if (valueArray.length > 1) {
						space = (valueArray[1] - valueArray[0]) / this.tpp;
					}
					
					this.dateAxis.draw(valueArray, offset, space);
				}
			}
			else {
				// 시간 단위 표시
				lastMills = date.setMinutes(0, 0, 0);
				
				while (date < end) {
					mills = date.setHours(date.getHours() + 1);
					
					if (mills - lastMills > limit) {
						valueArray[valueArray.length] = mills;
						
						lastMills = mills;
					}
					else {
					}
				}
				
				if (valueArray.length > 0) {
					offset = (valueArray[0] - this.start) / this.tpp;
					
					if (valueArray.length > 1) {
						space = (valueArray[1] - valueArray[0]) / this.tpp;
					}
					
					this.dateAxis.draw(valueArray, offset, space);
				}
			}
		},
		
		drawGraph: function (data) {
			var blocks = data.keys,
				width = this.rect.width,
				height = this.rect.height,
				dateArray, date;
			
			this.graph.setSize(width, height);
			this.graph.setTranslate(0, height);
			this.graph.setScale(1, -1);
			
			// y좌표 : value/high * height
			// x좌표 : (date - this.start) /tpp
			this.graph.avgPath.beginPath();
			//this.graph.avgPath.moveTo(0, 0);
		
			for (var i=0, numberOfBlock=blocks.length; i<numberOfBlock; i++) {
				dateArray = blocks[i];
				
				date = dateArray[0];
				
				this.graph.avgPath.moveTo((date - this.start) /this.tpp, this.data.get(date).max / this.high * height);
				
				for (var j=1,numberOfDate=dateArray.length; j<numberOfDate; j++) {
					date = dateArray[j];
					
					this.graph.avgPath.lineTo((date - this.start) /this.tpp, this.data.get(date).max / this.high * height);
				}
			}
			
			this.graph.avgPath.stroke();
		},
		
		add: function (svgElement) {
			this.container.appendChild(svgElement);
		},
		
		on: function (event, callback) {
			this.container.addEventListener(event, callback);
		}
	};
	
}) (window);

function SVGChart() {
}

(function (window, undefined) {
	var svgNS = "http://www.w3.org/2000/svg";
	
	function setTransform(svgChart) {
		var transformList = svgChart.container.transform.baseVal;
		
		svgChart.setTranslate = function (x, y) {
			transformList.getItem(0).setTranslate(x, y);
		};
		
		svgChart.setScale = function (x, y) {
			transformList.getItem(1).setScale(x, y || x);
		};
	}
	
	SVGChart.prototype = {
		initialize: function (chart, config) {
			this.chart = chart;
			this.container = document.createElementNS(svgNS, "g");
			this.container.setAttributeNS(null, "transform", "translate(0, 0) scale(1, 1)");
			
			setTransform(this);
			
			chart.add(this.container);
		},
		
		getSize: function () {
			return this.container.getBBox();
		},
		
		setSize: function (width, height) {
			this.container.setAttributeNS(null, "width", width);
			this.container.setAttributeNS(null, "height", height);
		},
		
		clear: function () {
			var svgElement;
			
			while(svgElement = this.container.firstChild) {
				this.container.removeChild(svgElement);
			}
		},
		
		addText: function (x, y, text) {
			var svgText = document.createElementNS(svgNS, "text");
			
			svgText.setAttributeNS(null, "x", x);
			svgText.setAttributeNS(null, "y", y);
			svgText.textContent = text;
			
			this.container.appendChild(svgText);
		}
	};

}) (window);

function Axis(chart, config) {
	if(arguments.length > 0) {
		this.initialize(chart, config || {});
	}
}

(function (window, undefined) {
	
	Axis.prototype = new SVGChart();
	
	Axis.prototype.initialize = function (chart, config) {
		SVGChart.prototype.initialize.call(this, chart, config);
	};
	
	Axis.prototype.draw = function (valueArray, space, high) {
		var length = valueArray.length;
		
		this.clear();
		
		for (var i=0; i<length; i++) {
			this.addText(0, space * i, (this.valueToString || valueToString) (valueArray[i], high));
		}
	};
	
}) (window);

function LeftAxis(chart, config) {
	this.initialize(chart, config || {});
}

(function (window, undefined) {
	
	LeftAxis.prototype = new Axis();
	
	LeftAxis.prototype.initialize = function (chart, config) {
		Axis.prototype.initialize.call(this, chart, config);
			
		this.container.classList.add("left");
	};
	
	LeftAxis.prototype.valueToString = function (value, capacity) {
		return value.toFixed(2);
	};
	
}) (window);

function RightAxis(chart, config) {
	this.initialize(chart, config || {});
}

(function (window, undefined) {
	
	RightAxis.prototype = new Axis();
	
	RightAxis.prototype.initialize = function (chart, config) {
		Axis.prototype.initialize.call(this, chart, config);
			
		this.container.classList.add("right");
	};
	
	RightAxis.prototype.valueToString = function (value, capacity) {
		return (value / capacity *100).toFixed(2) +"%";
	};
	
}) (window);

function DateAxis(chart, config) {
	this.initialize(chart, config || {});
}

(function (window, undefined) {
	var svgNS = "http://www.w3.org/2000/svg";
	
	DateAxis.prototype = new SVGChart();
	
	DateAxis.prototype.initialize = function (chart, config) {
		SVGChart.prototype.initialize.call(this, chart, config);
			
		this.container.classList.add("date");
	};
	
	DateAxis.prototype.draw = function (valueArray, offset, space) {
		var x = offset;
		
		this.clear();
		
		space = space || 0;
		
		for (var i=0, length = valueArray.length; i<length; i++) {
			text = document.createElementNS(svgNS, "text");
			
			text.setAttributeNS(null, "x", x + i * space);
			text.setAttributeNS(null, "y", 0);
			text.textContent = ITAhM.util.toDateFormatString(new Date(valueArray[i]));
			
			this.container.appendChild(text);
		}
	};
	
}) (window);

function Graph(chart, config) {
	this.initialize(chart, config || {});
}

(function (window, undefined) {
	
	Graph.prototype = new SVGChart();
	
	Graph.prototype.initialize = function (chart, config) {
		SVGChart.prototype.initialize.call(this, chart, config);
		
		this.maxPath = new Path(this.container);
		this.avgPath = new Path(this.container);
		this.minPath = new Path(this.container);
		
		this.container.setAttributeNS(null, "clip-path", "url(#"+ chart.getClipID() +")");
		
		this.container.classList.add("graph");
	};
			
}) (window);

function ChartData(data) {
	if (arguments.length > 0) {
		this.initialize(data);
	}
}

(function (window, undefined) {
	
	ChartData.prototype = {
		initialize: function (data) {
			this.data = data;
		},
		
		next: function (date) {
			return date.setMinutes(date.getMinutes() +1, 0, 0);
		},
		
		buildData: function (start, end, unit) {
			var keys = [],
				tmp = [],
				date = new Date(start),
				value, high, low;
			
			date.setSeconds(0, 0);
			
			do {
				value = this.data[mills];
				
				if (value) {
					tmp[tmp.length] = mills;
					
					high = Math.max(value, high || value);
					low = Math.min(value, low || value);
				}
				else if (tmp.length > 0) {
					data[data.length] = tmp;
					
					tmp = [];
				}
			} while (this.next(date) < end);
			
			if (tmp.length > 0) {
				data[data.length] = tmp;
			}
			
			return {
				high: high,
				low: low,
				keys: keys
			}
		}
		
	};
	
}) (window);

function ChartSummaryData(data) {
	if (arguments.length > 0) {
		this.initialize(data);
	}
}

(function (window, undefined) {
	
	ChartSummaryData.prototype = {
		initialize: function (data) {
			this.data = data;
		},
		
		next: function (date) {
			return date.setHours(date.getHours() +1, 0, 0, 0);
		},
		
		buildData: function (start, end) {
			var keys = [],
				tmp = [],
				date = new Date(start),
				mills, value, high, low;
			
			mills = date.setMinutes(0, 0, 0);
			
			do {
				value = this.data[mills];
				
				if (value) {
					tmp[tmp.length] = mills;
					
					high = Math.max(value.max, high || value.max);
					low = Math.min(value.min, low || value.min);
				}
				else if (tmp.length > 0) {
					keys[keys.length] = tmp;
					
					tmp = [];
				}
			}
			while ((mills = this.next(date)) < end);
			
			if (tmp.length > 0) {
				keys[keys.length] = tmp;
			}
			
			if (high === low) {
				high++;
				low--;
			}
			
			return {
				high: high,
				low: low,
				keys: keys
			}
		},
		
		get: function (date) {
			return this.data[date];
		}
	};
	
}) (window);

function createData() {
	return {
	    "1447160400000": {
	        "avg": 2,
	        "min": 1,
	        "max": 4
	    },
	    "1447146000000": {
	        "avg": 2,
	        "min": 0,
	        "max": 4
	    },
	    "1447099200000": {
	        "avg": 3,
	        "min": 1,
	        "max": 8
	    },
	    "1447095600000": {
	        "avg": 3,
	        "min": 3,
	        "max": 14
	    },
	    "1447128000000": {
	        "avg": 3,
	        "min": 1,
	        "max": 6
	    },
	    "1447088400000": {
	        "avg": 3,
	        "min": 2,
	        "max": 5
	    },
	    "1447138800000": {
	        "avg": 1,
	        "min": 1,
	        "max": 5
	    },
	    "1447110000000": {
	        "avg": 2,
	        "min": 1,
	        "max": 5
	    },
	    "1447164000000": {
	        "avg": 1,
	        "min": 1,
	        "max": 5
	    },
	    "1447120800000": {
	        "avg": 1,
	        "min": 1,
	        "max": 10
	    },
	    "1447131600000": {
	        "avg": 3,
	        "min": 1,
	        "max": 6
	    },
	    "1447142400000": {
	        "avg": 1,
	        "min": 0,
	        "max": 4
	    },
	    "1447153200000": {
	        "avg": 2,
	        "min": 1,
	        "max": 4
	    },
	    "1447113600000": {
	        "avg": 4,
	        "min": 0,
	        "max": 15
	    },
	    "1447106400000": {
	        "avg": 2,
	        "min": 1,
	        "max": 3
	    },
	    "1447117200000": {
	        "avg": 2,
	        "min": 0,
	        "max": 12
	    },
	    "1447156800000": {
	        "avg": 2,
	        "min": 1,
	        "max": 4
	    },
	    "1447084800000": {
	        "avg": 3,
	        "min": 2,
	        "max": 4
	    },
	    "1447149600000": {
	        "avg": 1,
	        "min": 1,
	        "max": 3
	    },
	    "1447135200000": {
	        "avg": 1,
	        "min": 0,
	        "max": 13
	    },
	    "1447081200000": {
	        "avg": 2,
	        "min": 1,
	        "max": 4
	    },
	    "1447092000000": {
	        "avg": 3,
	        "min": 3,
	        "max": 5
	    },
	    "1447102800000": {
	        "avg": 1,
	        "min": 1,
	        "max": 4
	    },
	    "1447124400000": {
	        "avg": 3,
	        "min": 2,
	        "max": 10
	    }
	};
}