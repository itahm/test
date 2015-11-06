;"use strict";

var
	HOUR1 = 60 *60 *1000,
	MINUTES1 = 60 *1000,
	WHEEL_REPEAT = 20,
	MONTH_NAME = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function Chart(container, config) {
	this.init(container, config);
}

function format(milliseconds) {
	var date = new Date(milliseconds),
		day = date.getDate(),
		hour = date.getHours();
	
	if (day === 1) {
		return MONTH_NAME[date.getMonth()];
	}
	else {
		return MONTH_NAME[date.getMonth()] +" "+ (day > 9? "": "0")+ day +", "+ (hour > 9? "": "0") + hour;
	}
}

(function (window, undefined) {
	
	function onWheel (manager, e) {
		if (manager.mode === "realtime") {
			return;
		}
		
		var zoom = e.deltaY > 0? true: false;
		
		for (var i=0; i<WHEEL_REPEAT; i++) {
			manager.zoom(zoom);
		}

		manager.onchange(this.start, this.end);
		
		manager.invalidate();
	}
	
	function onDrag(manager, e) {
		if (manager.mode === "realtime") {
			return;
		}
		
		manager.move(e.moveX);
		
		manager.onchange(manager.start, manager.end);
		
		manager.invalidate();
	}
	
	function onDragEnd(manager, e) {console.log("!");
		if (manager.mode === "realtime" || this.tpp > MINUTES1) {
			return;
		}
		console.log(manager.ondetail);
		manager.ondetail();
	}
	
	function invalidateRT(manager) {
		var data = {},
			high = manager.high,
			low = manager.low;
		
		if (high == low) {
			high++;
			low = Math.max(0, --low);
		}
		
		manager.chart.clear();
		
		manager.chart.setYAxis(high, low, 100);
		
		// y축 width 변화로 start가 변경되었음
		manager.setCurrent()
		
		manager.chart.setXAxis(manager.getAxisValues());
		
		manager.resetScale(high, low);
		
		// data가 무한히 늘어나는것을 방지하기 위해 key가 start보다 작은것은 삭제하고 다시 data를 만들어 준다.
		manager.chart.draw({
			stroke: "#0f0",
			width: 2,
			keys: [Object.keys(manager.data)],
			get: function (key) {
				var value = manager.data[key],
					coords = {
						x: (key - manager.start) / manager.tpp,
						y: (value - low) * manager.scale
					};
				
				if (manager.start <= key) {
					data[key] = value;
				}
				
				return coords;
			}.bind(manager)
		});
		
		manager.data = data;
	}
	
	/**
	 * chart method 호출순서
	 * clear
	 * setYAxis
	 * setXAxis
	 * draw
	 */
	function invalidateOL(manager) {
		var date = new Date(manager.start),
			dateMills = date.setMinutes(0, 0, 0),
			endMills = (function (date) {
				var mills = date.getTime();
				
				if (mills == date.setMinutes(0, 0, 0)) {
					return mills;
				}
				
				return date.setHours(date.getHours() +1);
			})(new Date(manager.end)),
			block = [],
			high, max, min, low;
		
		manager.blocks = [block];
		
		// block array 만드는 과정
		while (dateMills <= endMills) {
			if (dateMills in manager.data) {
				block[block.length] = dateMills;
			}
			else if (block.length > 0) {
				block = [];
				manager.blocks[manager.blocks.length] = block;
			}
			
			dateMills = date.setHours(date.getHours() +1);
		}
		
		if (block.length === 0) {
			manager.blocks.splice(manager.blocks.length -1, 1);
		}
		
		// high, low 구하는 과정
		for (var i=0, _i=manager.blocks.length; i<_i; i++) {
			block = manager.blocks[i];
			
			max = Math.max.apply(undefined, block.map(function (key) {return manager.data[key].max;}.bind(manager)));
			min = Math.min.apply(undefined, block.map(function (key) {return manager.data[key].min;}.bind(manager)));
			
			high = i == 0? max: Math.max(high, max);
			low = i == 0? min: Math.min(low, min);
		}
		
		low = Math.max(0, low);
		
		manager.chart.clear();
		
		manager.chart.setYAxis(high, low);
		
		// y축 width 변화로 tpp 변화 적용해 줘야함
		manager.resetTPP();
		
		manager.chart.setXAxis(manager.getAxisValues());
		
		manager.resetScale(high, low);
		
		manager.low = low;
		
		
		
		// 다시 그려지면 detail 삭제
		manager.detail = undefined;
		
		manager.chart.draw({
			fill: "#e0ffff",
			keys: manager.blocks,
			get: function (key) {
				return {
					x: (key - manager.start) / manager.tpp,
					y: (manager.data[key].max - low) * manager.scale
				}
			}.bind(manager)
		});
		
		manager.chart.draw({
			fill: "#fff",
			option: "cut",
			keys: manager.blocks,
			get: function (key) {
				return {
					x: (key - manager.start) / manager.tpp,
					y: (manager.data[key].min - low) * manager.scale
				}
			}.bind(manager)
		});
		
		manager.chart.draw({
			stroke: "#73a4e6",
			width: 2,
			keys: manager.blocks,
			get: function (key) {
				return {
					x: (key - manager.start) /manager.tpp,
					y: (manager.data[key].avg - low) * manager.scale
				}
			}.bind(manager)
		});
	}
	
	Chart.prototype = {
		init: function (container, config) {
			var date = new Date();
			
			this.data = {};
			this.chart = new ChartObject(container, config);
			this.blocks = [];
			this.start = date.setHours(0, 0, 0, 0);
			this.end = date.setDate(date.getDate() +1);
			this.setMode("offline");
			this.ondetail = config && config.detail || function () {};
			
			this.chart.element.addEventListener("wheel", onWheel.bind(undefined, this));
			window.addEventListener("resize", this.listener = this.resize.bind(this));
			
			new Draggable(this.chart.element)
				.on("dragmove", onDrag.bind(undefined, this))
				.on("dragend", onDragEnd.bind(undefined, this));
		},
		
		resetTPP: function () {
			if (this.chart.graphArea.width === 0) {
				throw "";
			}
			
			this.tpp = ((this.end - this.start) / this.chart.graphArea.width);
			
			return this.tpp;
		},
		
		isEmpty: function () {
			for (var key in this.data) {
				return false;
			}
			
			return true;
		},
		
		/**
		 * @param {Number} high
		 * @param {Number} low 
		 */
		resetScale: function (high, low) {
			return this.scale = this.chart.graphArea.height / (high - low);
		},
		
		/**
		 * start 또는 end가 변경되면 발생되는 callback
		 * @param {Number} start
		 * @param {Number} end
		 */
		onchange: function (start, end) {
			
		},
		
		/**
		 * 전으로 이동시 양수, 후로 이동시 음수
		 * @param {Number} move
		 */
		move: function (move) {
			move *= this.tpp;
			
			this.start -= move;
			this.end -= move;
		},
		
		/**
		 * 
		 * @param {Boolean} zoom 확대시 true, 축소시 false
		 */
		zoom: function (zoom) {
			var sign = zoom? -1: 1;
			
			this.end -= this.tpp * sign;
			this.start += this.tpp * sign;
				
			this.resetTPP();
		},
		
		/**
		 * offline lony
		 * @param {Number} start 시작 날짜 (milliseconds)
		 * @param {Number} end 끝 날짜 (milliseconds)
		 */
		setDate: function (start, end) {
			this.start = start;
			this.end = end;
			
			this.resetTPP();
			
			this.invalidate();
		},
		
		/*
		 * realtime only
		 */
		setCurrent: function () {
			var date = new Date();
			
			this.end = date.setMilliseconds(0);
			this.start = this.end - this.tpp * this.chart.graphArea.width;
		},
		
		clear: function () {
			this.data = {};
		},
		
		setMode: function (mode) {
			if (mode === "realtime") {
				this.tpp = 100;
				this.setCurrent();
				//this.invalidate = invalidateRT.bind(undefined, this);
			}
			else if (mode === "offline") {
				this.resetTPP();
				//this.invalidate = invalidateOL.bind(undefined, this); 
			}
			
			this.mode = mode;
		},
		
		/**
		 * realtime mode only
		 * @param {Number} dateMills
		 * @param {Number} value
		 * @returns {undefined}
		 */
		update: function (dateMills, value) {
			var	values;
			
			this.data[dateMills] = value;
			
			// data가 삭제되는 경우를 가정하여 항상 high, low를 다시 계산한다.
			values = Object.keys(this.data).map(function (key) {return this.data[key];});
			this.high = Math.max.apply(undefined, values);
			this.low = Math.min.apply(undefined, values);
			
			this.move(this.end - dateMills);
			
			this.invalidate();
		},
		
		/**
		 * @returns {Array} 
		 */
		getAxisValues: function () {
			var	date = new Date(this.start),
				dateMills,
				pow = (function (tpp) {
					var date = new Date(0),
						gap = GRID_MIN_WIDTH * tpp + date.getTime(),
						pow = 0;
				
					for (; gap > date.setHours(date.getHours() +1); pow++);
				
					return Math.max(pow, 1);
				})(this.tpp),
				axisValueArray = [];
			
			date.setMinutes(0, 0, 0);
			
			while ((dateMills = date.setHours(date.getHours() + pow)) < this.end) {
				axisValueArray[axisValueArray.length] = [(dateMills - this.start) / this.tpp, format(dateMills)];
			}
			
			return axisValueArray;
		},
		
		download: function () {
			var row, block, date, dateMills, value;
			
			if (this.detail) {
				row = ["index,date,value"];
				
				block = Object.keys(this.detail).sort(function (a, b) {
					return Number(a) - Number(b);
				});
				
				for (var i=0, _i=block.length; i<_i;i++) {
					dateMills = block[i];
					
					date = new Date(Number(dateMills));
					
					row[row.length] = [i,
					                   date.toISOString().slice(0, 10) + " "+ date.toTimeString().slice(0, 8),
					                   this.detail[dateMills]].join(","); 
				}
			}
			else {
				row = ["index,date,max,avg,min"];
				
				for (var i=0, _i=this.blocks.length; i<_i; i++) {
					block = this.blocks[i];
					
					for (var j=0, _j=block.length; j<_j; j++) {
						dateMills = block[j];
						date = new Date(dateMills);
						value = this.data[dateMills];
						
						row[row.length] = [j,
						                   date.toISOString().slice(0, 10) + " "+ date.toTimeString().slice(0, 8),
						                   value.max,
						                   value.avg,
						                   value.min].join(",");
					}
				}
			}
			
			ITAhM.util.download(new Blob([row.join("\n")], { type: "text/csv;charset=utf-8;"}), "chart.csv");
		},
		
		showDetail: function (detail) {			
			this.chart.draw({
				stroke: "#f00",
				width: .5,
				keys: [Object.keys(detail)],
				get: function (key) {
					var coords = {
							x: (key - this.start) /this.tpp,
							y: (detail[key] - this.low) * this.scale
						};

					return coords;
				}.bind(this)
			});
		},
		
		resize: function () {
			if (this.mode === "realtime") {
				this.setCurrent();
				
				invalidateRT(this);
			}
			else {
				this.resetTPP();
				
				invalidateOL(this);
			}
		},
		
		invalidate: function () {
			if (this.mode === "realtime") {
				invalidateRT(this);
			}
			else {
				invalidateOL(this);
			}
		},
		
		on: function (event, func) {
			this.chart.element.addEventListener(event, func, false);
		},
		
		append: function (element) {
			this.chart.element.appendChild(element);
		},
		
		close: function () {
			window.removeEventListener("resize", this.listener, false);
			
			this.chart.element.parentNode.removeChild(this.chart.element);
			this.chart = undefined;
		}
		
	};
	
})(this);	