;"use strict";

var
	MINUTES1 = 60000,
	HOURS1 = 3600000,
	HOURS24 = 86400000,
	GRID_MIN_WIDTH = 200,
	GRID_MIN_HEIGHT = 50,
	SUMMARY_MIN_PX = 1,
	PADDING = 30,
	MARGIN = 10,
	FONT_SIZE = 14,
	MODE_FIX = 0,
	MODE_START = 1,
	MODE_END = 2,
	MODE_MOVE = MODE_START | MODE_END,
	BG_COLOR = "#ffffff";

function ChartObject(container) {
	this.init(container);
}

function fireEvent(eventType, element) {
	var event = document.createEvent("Event");
	
	event.initEvent(eventType, true, true);
	
	element.dispatchEvent(event);
}

(function (window, undefined) {
	
	/**
	 * @param {Array} textArray /out/
	 */
	function getMaxWidth(chart, valueGap, low, count, textArray) {
		var value, max, text;
		
		for (var i=0; i<=count; i++) {
			value = low + valueGap * i;
			text = chart.onyvalue(value);
			textArray[i] = [text, (value / chart.capacity *100).toFixed(2) +"%"];
			
			if (max === undefined) {
				max = chart.context.measureText(text).width;
			}
			else {
				max = Math.max(max, chart.context.measureText(text).width);
			}
		}
		
		return max;
	}
	
	function setYAxis(chart, nodata) {
		var count = Math.floor(chart.graphArea.height /GRID_MIN_HEIGHT),
			width = chart.graphArea.width,
			x = {
				left: PADDING,
				right: chart.canvas.width - PADDING
			};
		
		// y축 눈금의 갯수가 1보다 작으면 그리지 않음 (눈금 하나의 길이가 GRID_MIN_HEIGHT보다 작음)
		if (count === 0) {
			return;
		}
		
		// 그릴 data가 없음
		if (!!nodata) {
			chart.axisLeftWidth = 0;
			chart.axisRightWidth = 0;
		}
		else {
			drawXAxis(chart, x, count);
		}
		
		drawYAxis(chart, x);
		
		setGraphWidth(chart);
	}

	function drawXAxis(chart, x, count) {
		var context = chart.context,
			gridContext = chart.gridContext,
			axisGap = chart.graphArea.height / count,
			valueGap = (chart.high - chart.low) / count,
			y = PADDING + chart.axisTopHeight + MARGIN, y2,
			textArray = [];
		
		// getMaxWidth를 통해 width를 계산하기도 하지만 더불어 textArray를 완성해 옴.
		x.left += (chart.axisLeftWidth = getMaxWidth(chart, valueGap, chart.low, count, textArray));
		x.right -= (chart.axisRightWidth = context.measureText("100.00%").width);
		
		context.save();
		context.textBaseline = "middle";
		context.textAlign = "right";
		
		gridContext.beginPath();
		
		// 가로 선 path 만들고 y축 라벨 붙이기
		count++;
		for(; count-- > 0; y += axisGap) {
			y2 = Math.round(y);
			
			context.save();
			context.textAlign = "left";
			context.fillText(textArray[count][1], x.right, y2);
			context.restore();
			
			gridContext.moveTo(x.left, y2 -.5);
			gridContext.lineTo(x.right, y2 -.5);	
			
			context.fillText(textArray[count][0], x.left, y2);
		}
		
		context.restore();
		
		// 가로선 그리기
		gridContext.save();
		gridContext.strokeStyle = "#ddd";
		gridContext.lineWidth = 1;
		gridContext.globalAlpha = .2;
		gridContext.stroke();
		gridContext.restore();
	}
	/**
	 * @param x1 graph area 시작 x 좌표
	 * @param x2 graph area 끝 x좌표
	 */
	function drawYAxis(chart, x) {
		var context = chart.gridContext,
			y = PADDING + chart.axisTopHeight + MARGIN,
			y2 = y + chart.graphArea.height;
			
		x.left += (MARGIN -1);
		x.right += (-MARGIN -1);
		
		context.beginPath();
		context.moveTo(x.left, y);
		context.lineTo(x.left, y2);
		context.moveTo(x.right, y);
		context.lineTo(x.right, y2);
		context.stroke();
		
		context.save();
		context.textBaseline = "bottom";
		context.textAlign = "center";		
		
		context.fillText(chart.title, Math.round((x.right + x.left) /2), y - MARGIN);
		context.restore();
	}

	function init(chart) {
		var context;
		
		context = chart.context;
		context.font = "normal "+ FONT_SIZE +"px tahoma, arial, '맑은 고딕'";
		
		context = chart.gridContext;
		context.font = "normal "+ FONT_SIZE +"px tahoma, arial, '맑은 고딕'";
		context.lineWidth = 2;
		context.strokeStyle = "#73a4e6";
	}
	
	function getFile(data, startMills, endMills) {
		var file = [],
			date = new Date(startMills),
			dateMills = date.setSeconds(0, 0),
			index=0, value;
	
		file[0] = "index,date,value";
		
		while (dateMills < endMills) {
			value = data[dateMills];
			
			if (value) {
				file[file.length] = index++ +","+ date.toISOString().slice(0, 10) + " "+ date.toTimeString().slice(0, 8) +","+ value;
			}
			
			dateMills = date.setMinutes(date.getMinutes() +1);
		}
		
		return "data:text/csv;charset=utf-8,"+ encodeURI(file.join("\n"));
	}
	
	function getSummaryFile(data, startMills, endMills) {
		var file = [],
			date = new Date(startMills),
			dateMills = date.setMinutes(0, 0, 0),
			index=0, value;
		
		file[0] = "index,date,max,avg,min";
		
		while (dateMills < endMills) {
			value = data[dateMills];
			
			if (value) {
				file[file.length] = index++ +","+ date.toISOString().slice(0, 10) + " "+ date.toTimeString().slice(0, 8) +","+ value.max +","+ value.avg +","+ value.min;
			}
			
			dateMills = date.setHours(date.getHours() +1);
		}
	
		return "data:text/csv;charset=utf-8,"+ encodeURI(file.join("\n"));
	}
	
	function setGraphWidth(chart) {
		return chart.graphArea.width
			= Math.max(0, chart.canvas.width - (chart.axisRightWidth + chart.axisLeftWidth + PADDING *2 + MARGIN *2));
	}
	
	function setGraphHeight(chart) {
		return chart.graphArea.height
			= Math.max(0, chart.canvas.height - (chart.axisTopHeight + chart.axisBottomHeight + PADDING *2 + MARGIN *2));
	}
	
	/**
	 * @param {ChartObject} chart
	 * @param {Canvas} canvas
	 */
	function drawGraph(chart, canvas) {
		try {
			chart.context.drawImage(canvas, PADDING + chart.axisLeftWidth + MARGIN, PADDING + chart.axisTopHeight + MARGIN);
		}
		catch (e) {
			console.log(chart);
			console.log(chart.context);
			console.log(canvas);
			console.log(e);
		}
	}
	
	function cutGraph(chart, canvas) {
		chart.context.save();
		chart.context.globalCompositeOperation = "destination-out";
		chart.context.drawImage(canvas, PADDING + chart.axisLeftWidth + MARGIN, PADDING + chart.axisTopHeight + MARGIN);
		chart.context.restore();
	}
	
	function saveChart(chart) {
		chart.lastImage = chart.context.getImageData(0, 0, chart.canvas.width, chart.canvas.height);
		chart.context.drawImage(chart.grid, 0, 0);
	}

	ChartObject.prototype = {
		init: function (container) {
			this.element = document.createElement("div");
			this.canvas = document.createElement("canvas");
			this.grid = document.createElement("canvas");
			this.context = this.canvas.getContext("2d");
			this.gridContext = this.grid.getContext("2d");
			this.graphArea = {};
			this.title = "";
			this.capacity = 100;
			this.axisLeftWidth = 0;
			this.axisRightWidth = 0;
			this.axisTopHeight = FONT_SIZE;
			this.axisBottomHeight = FONT_SIZE;
			this.ondrag = function () {};
			
			this.onyvalue = function (value) {
				return value;
			}
			
			this.element.appendChild(this.canvas);
			this.element.className = "chart";
			
			container.appendChild(this.element);
			
			//this.resize();
			
			//fireEvent("resize", window);
		},
		
		onresize: function () {
			
		},
		
		resize: function () {
			var rect = this.element.getBoundingClientRect(),
				width = Math.max(rect.width, PADDING *2),
				height = Math.max(rect.height, PADDING *2);
			
			this.canvas.width = width;
			this.canvas.height = height;
			this.grid.width = width;
			this.grid.height = height;
			
			setGraphWidth(this);
			setGraphHeight(this);
			
			init(this);
		},
		
		/**
		 * 
		 * @param {Object} chartData
		 * @param {Array} [chartData.keys] Array[Array[]] 이어야 함 !!! 중요!!! 자주하는 실수!!!
		 * 
		 */
		draw: function (chartData) {
			var canvas = document.createElement("canvas"),
				context = canvas.getContext("2d"),
				low = this.low,
				blockArray = chartData.keys,
				getValue = chartData.get,
				fill = chartData.fill,
				stroke = chartData.stroke,
				block, length;
			
			canvas.width = this.graphArea.width;
			canvas.height = this.graphArea.height;
			
			context.setTransform(1, 0, 0, -1, 0, this.graphArea.height);
			
			for (var i=0, _i=blockArray.length; i<_i; i++) {
				block = blockArray[i];
				
				context.beginPath();
				
				coords = getValue(block[0]);
				
				if (fill) {
					context.moveTo(coords.x, 0);
				}
				
				context.lineTo(coords.x, coords.y);
				
				for (var index=1, length = block.length; index<length; index++) {
					coords = getValue(block[index]);
					
					context.lineTo(coords.x, coords.y);
				}
				
				if (fill) {
					context.lineTo(coords.x, 0);
					context.closePath();
					
					context.fillStyle = fill;
					context.fill();
				}
				
				if (stroke) {
					context.strokeStyle = stroke;
					context.lineWidth = chartData.width;
					context.stroke();
				}
			}
			
			if (fill && chartData.option === "cut") {
				cutGraph(this, canvas);
			}
			else {
				drawGraph(this, canvas);
			}
			
			saveChart(this);
		},
		
		/**
		 *@param {Number} high
		 * @param {Number} low
		 */
		setYAxis: function(high, low) {
			switch(arguments.length) {
			case 0:
				setYAxis(this, true);
				
				break;
			case 2:
				var high = arguments[0],
					low = arguments[1];
				
				if (high == low) {
					++high;
					low = Math.max(0, --low);
				}
				
				this.high = high;
				this.low = low;
			
				setYAxis(this);
				
				break;
			}
		},
		
		/**
		 * @param {Array} valueArray
		 */
		setXAxis: function(valueArray) {
			var data;
			
			this.context.save();
			this.context.textBaseline = "bottom";
			this.context.textAlign = "center";
			this.context.setTransform(1, 0, 0, 1, PADDING + this.axisLeftWidth + MARGIN, this.canvas.height - PADDING);
			
			for (var i=0, _i=valueArray.length; i<_i; i++) {
				data = valueArray[i];
				
				this.context.fillText(data[1], data[0], 0);
			}
			
			this.context.restore();
		},
		
		clear: function () {
			var width = this.canvas.width,
				height = this.canvas.height;
			
			//this.context.save();
			//this.context.setTransform(1, 0, 0, 1, 0, 0);
			this.context.clearRect(0, 0, width, height);
			//this.context.restore();
			
			this.gridContext.clearRect(0, 0, width, height);
		},
		
		download: function () {
			if (this.canvas.msToBlob) {
				window.navigator.msSaveBlob(this.canvas.msToBlob(), "chart.png");
			}
			else {
				var a = document.createElement("a"),
					event = document.createEvent("Event");
				
				a.setAttribute("download", "chart.png");
				a.setAttribute("href", this.canvas.toDataURL("image/png;base64"));
				
				fireEvent("click", a);
			}
		},
		
		/**
		 * @param {Manager} manager
		 */
		connect: function (manager) {
			this.manager = manager;
			
			manager.resize();
		}
		
	};
	
}) (window);