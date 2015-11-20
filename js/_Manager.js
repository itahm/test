;"use strict";

var
	HOUR1 = 60 *60 *1000,
	MINUTES1 = 60 *1000,
	WHEEL_REPEAT = 20,
	MONTH_NAME = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * manager가 하는 일
 * offline인 경우
 * data 관리
 * tpp 관리
 */
function Manager() {}

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
	var managerMap = {
			ChartManager: ChartManager,
			RealTimeManager: RealTimeManager
		};
	
	Manager.getInstance = function (chart, managerName) {
		return new (managerMap[managerName] || ChartManager) ();
	};
	
	Manager.prototype = {
		init: function () {
			this.data = {};
			this.chart;
			
			window.addEventListener("resize", this.resize.bind(this), false);
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
		 * @param {Number} move 이동 횟수
		 * @param {Boolean} zoom 확대시 true, 축소시 false
		 */
		zoom: function (zoom) {
			var sign = zoom? -1: 1;
			
			this.end -= this.tpp * sign;
			this.start += this.tpp * sign;
				
			this.resetTPP();
		},
		
		/**
		 * @abstract
		 */
		resize: function () {
			this.chart.resize();
		},
		
		/**
		 * @abstract
		 */
		invalidate: function () {
			
		},
		
		/**
		 * @param {Number} start 시작 날짜 (milliseconds)
		 * @param {Number} end 끝 날짜 (milliseconds)
		 */
		setDate: function (start, end) {
			this.start = start;
			this.end = end;
			
			this.resetTPP();
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
		}
	};
	
	function RealTimeManager(chart) {
		this.init(chart);
	};
	
	RealTimeManager.prototype = new Manager();
	RealTimeManager.constructor = RealTimeManager;
	
	/**
	 * @type {Number}
	 * @const
	 */
	RealTimeManager.TPP = 100;
	
	RealTimeManager.prototype.init = function (chart) {
		Manager.prototype.init.call(this, chart);
		
		this.tpp = RealTimeManager.TPP;
		
		this.setDate();
	}
	
	/**
	 * @param {Number} dateMills
	 * @param {Number} value
	 * @returns {undefined}
	 */
	RealTimeManager.prototype.update = function (dateMills, value) {
		var	data = this.data,
			values;
		
		data[dateMills] = value;
		
		// data가 삭제되는 경우를 가정하여 항상 high, low를 다시 계산한다.
		values = Object.keys(data).map(function (key) {return data[key];});
		this.high = Math.max.apply(undefined, values);
		this.low = Math.min.apply(undefined, values);
		
		this.move(this.end - dateMills);
		
		this.invalidate();
	}
	
	RealTimeManager.prototype.invalidate = function () {
		var data = {},
			high = this.high,
			low = this.low;
		
		if (high == low) {
			high++;
			low--;
		}
		
		this.chart.clear();
		
		this.chart.setYAxis(high, low, 100);
		
		// y축 width 변화로 start가 변경되었음
		this.setDate()
		
		this.chart.setXAxis(this.getAxisValues());
		
		this.resetScale(high, low);
		
		// data가 무한히 늘어나는것을 방지하기 위해 key가 start보다 작은것은 삭제하고 다시 data를 만들어 준다.
		this.chart.draw({
			capacity: 100,
			stroke: "#0f0",
			width: 2,
			keys: [Object.keys(this.data)],
			get: function (key) {
				var value = this.data[key],
					coords = {
						x: (key - this.start) / this.tpp,
						y: (value - low) * this.scale
					};
				
				if (this.start <= key) {
					data[key] = value;
				}
				
				return coords;
			}.bind(this)
		});
		
		this.data = data;
	}
	
	RealTimeManager.prototype.resize = function () {
		Manager.prototype.resize.call(this);
		
		if (this.isEmpty()) {
			return;
		}
		
		this.setDate();
		
		this.invalidate();
	}
	
	RealTimeManager.prototype.setDate = function () {
		var date = new Date(),
			end = date.getTime(),
			start = end - this.tpp * this.chart.graphArea.width;
		
		Manager.prototype.setDate.call(this, start, end);
	}
	
	RealTimeManager.prototype.clear = function () {
		this.data = {};
	}
	
	/**
	 * @constructor
	 * @param {Chart} chart
	 */
	function ChartManager(chart) {
		this.init(chart);
	}
	
	ChartManager.prototype = new Manager();
	ChartManager.constructor = ChartManager;
	
	ChartManager.prototype.init = function (chart) {
		Manager.prototype.init.call(this, chart);
		
		var date = new Date();
		
		//this.tpp = this.resetTPP();
		this.blocks = [];
		this.start = date.setHours(0, 0, 0, 0);
		this.end = date.setDate(date.getDate() +1);
		
		chart.addEventListener("wheel", this.onwheel.bind(this));
		
		new Draggable(chart.chart).on("dragmove", this.ondrag.bind(this));
	}
	
	ChartManager.prototype.ondrag = function (e) {
		this.move(e.moveX);
		
		this.onchange(this.start, this.end);
		
		this.invalidate();
	}
	
	ChartManager.prototype.onwheel = function (e) {
		var zoom = e.deltaY > 0? true: false;
		
		for (var i=0; i<WHEEL_REPEAT; i++) {
			this.zoom(zoom);
		}

		this.onchange(this.start, this.end);
		
		this.invalidate();
	}
	
	ChartManager.prototype.download = function () {
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
	}
	
	ChartManager.prototype.showDetail = function () {
		if (this.tpp > MINUTES1) {
			alert("itahm could not show you more detailed chart view");
			
			return;
		}
		
		var hDate = new Date(this.start),
			mDate = new Date(this.start),
			next = hDate.setMinutes(0, 0, 0),
			mMills = mDate.setSeconds(0, 0),
			value, max, min, avg;

		this.detail = {};
		
		for (; next < this.end; next = hDate.setHours(hDate.getHours() +1)) {
			if (next in this.data) {
				value = this.data[next];
				
				avg = value.avg;
				max = value.max;
				min = value.min;
				
				for(; mMills < next; mMills = mDate.setMinutes(mDate.getMinutes() +1)) {
					this.detail[mMills] = min + Math.random() * (max - min);
				}
			}
		}
		
		this.chart.draw({
			capacity: 100,
			stroke: "#f00",
			width: .5,
			keys: [Object.keys(this.detail)],
			get: function (key) {
				var coords = {
						x: (key - this.start) /this.tpp,
						y: (this.detail[key] - this.low) * this.scale
					};

				return coords;
			}.bind(this)
		});
	}
	
	ChartManager.prototype.invalidate = function () {
		var date = new Date(this.start),
			dateMills = date.setMinutes(0, 0, 0),
			endMills = (function (date) {
				var mills = date.getTime();
				
				if (mills == date.setMinutes(0, 0, 0)) {
					return mills;
				}
				
				return date.setHours(date.getHours() +1);
			})(new Date(this.end)),
			block = [],
			high, max, min, low;
		
		this.blocks = [block];
		
		// block array 만드는 과정
		while (dateMills <= endMills) {
			if (dateMills in this.data) {
				block[block.length] = dateMills;
			}
			else if (block.length > 0) {
				block = [];
				this.blocks[this.blocks.length] = block;
			}
			
			dateMills = date.setHours(date.getHours() +1);
		}
		
		if (block.length === 0) {
			this.blocks.splice(this.blocks.length -1, 1);
		}
		
		// high, low 구하는 과정
		for (var i=0, _i=this.blocks.length; i<_i; i++) {
			block = this.blocks[i];
			
			max = Math.max.apply(undefined, block.map(function (key) {return this.data[key].max;}.bind(this)));
			min = Math.min.apply(undefined, block.map(function (key) {return this.data[key].min;}.bind(this)));
			
			high = i == 0? max: Math.max(high, max);
			low = i == 0? min: Math.min(low, min);
		}
		
		this.chart.clear();
		
		this.chart.setYAxis(high, low, 100);
		
		// y축 width 변화로 tpp 변화 적용해 줘야함
		this.resetTPP();
		
		this.chart.setXAxis(this.getAxisValues());
		
		this.resetScale(high, low);
		
		this.low = low;
		
		
		
		// 다시 그려지면 detail 삭제
		this.detail = undefined;
		
		this.chart.draw({
			capacity: 100,
			fill: "#e0ffff",
			keys: this.blocks,
			get: function (key) {
				return {
					x: (key - this.start) / this.tpp,
					y: (this.data[key].max - low) * this.scale
				}
			}.bind(this)
		});
		
		this.chart.draw({
			capacity: 100,
			fill: "#fff",
			option: "cut",
			keys: this.blocks,
			get: function (key) {
				return {
					x: (key - this.start) / this.tpp,
					y: (this.data[key].min - low) * this.scale
				}
			}.bind(this)
		});
		
		this.chart.draw({
			capacity: 100,
			stroke: "#73a4e6",
			width: 2,
			keys: this.blocks,
			get: function (key) {
				return {
					x: (key - this.start) /this.tpp,
					y: (this.data[key].avg - low) * this.scale
				}
			}.bind(this)
		});
	}
	
	ChartManager.prototype.resize = function () {
		Manager.prototype.resize.call(this);
		
		this.resetTPP();
		
		this.invalidate();
	}
	
	/**
	 * @param {Number} start 시작 날짜 (milliseconds)
	 * @param {Number} end 끝 날짜 (milliseconds)
	 */
	ChartManager.prototype.setDate = function (start, end) {
		Manager.prototype.setDate.call(this, start, end);
		
		this.invalidate();
	}
	
})(this);	