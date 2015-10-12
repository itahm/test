;"use strict";

function Canvas() {
	this.init(arguments);
}

function getPos(canvas, e) {
	var rect = canvas.getBoundingClientRect();
	
	return {
		x: e.clientX - rect.left,
		y: e.clientY - rect.top
	};
}

/**************************************************************************************************
 * Canvas
 **************************************************************************************************/

(function(window, undefined) {
	
	function onDragStart() {
		
	}
	
	function onDragMove() {
		
	}

	function onDragEnd() {
		
	}
	
	function onMouseMove(canvas, e) {
		var rect = canvas.container.getBoundingClientRect(),
			node = canvas.hitTest(e.clientX - rect.left, e.clientY - rect.top);
		
		if (node !== canvas.node) {
			if (canvas.node) {
				this.onleave(canvas.node.data);
			}
		
			if (node) {
				this.onenter(node.data);
			}
		}
		
		canvas.node = node;
	}
	
	function onWheel(canvas, e) {
		clearTimeout(canvas.timer);
		
		canvas.timer = setTimeout(canvas.zoom.bind(canvas, e.deltaY < 0), 100);
	}
	
	function onResize(canvas) {
		clearTimeout(canvas.timer);
		
		canvas.timer = setTimeout(canvas.resize.bind(canvas), 100);
	}

	Canvas.prototype = {
		
		/**
		 * 
		 * @param {Array} args
		 * @param {DomElement} [args[0]] container
		 */
		init: function (args) {
			this.container = args[0];
			
			this.canvas = document.createElement("canvas");
			this.context = this.canvas.getContext("2d");
			
			this.scale = 1;
			this.layers = [];
			this.eventHandler = {}
			this.ondraw = function (context, hitContext, data) {}
			this.node;
			this.onenter = function (data) {console.log("enter", data);}
			this.onleave = function (data) {console.log("leave", data);}
			
			this.resize();
			
			this.container.appendChild(this.canvas);
			this.container.addEventListener("mousemove", onMouseMove.bind(this, this), false);
			
			//this.container.addEventListener("mousedown", onMouseDown.bind(this), false);
			//this.container.addEventListener("mouseup", onMouseUp.bind(this), false);
			//this.canvas.addEventListener("mouseout", onMouseUp.bind(this), false);
			
			
			this.container.addEventListener("mousewheel", onWheel.bind(this, this), false);
			window.addEventListener("resize", onResize.bind(this, this), false);
			
			new Draggable(this.container)
			.on("dragstart", onDragStart.bind(this))
			.on("dragmove", onDragMove.bind(this))
			.on("dragend", onDragEnd.bind(this));
		},
		
		add: function () {
			var layer = new Layer(this);
			
			layer.resize(this.width, this.height);
			
			this.layers[this.layers.length] = layer;
			
			return layer;
		},
		
		zoom: function (zoonIn) {
			this.scale *= zoonIn? 1.2: 1 /1.2;
			
			for (var i=0, length=this.layers.length; i<length; i++) {
				this.layers[i].zoom(this.scale);
			}
			
			this.invalidate();
		},
	
		resize: function(e) {
			var rect = this.container.getBoundingClientRect(),
				width = rect.width,
				height = rect.height;
			
			this.width = width;
			this.height = height;
			
			this.canvas.width = width;
			this.canvas.height = height;
			
			for (var i=0, length=this.layers.length; i<length; i++) {
				this.layers[i].resize(this.width, this.height);
			}
			
			this.invalidate();
		},
		
		empty: function () {
			for (var i=0, length=this.layers.length; i<length; i++) {
				this.layers[i].empty();
			}
		},
		
		hitTest: function (x, y) {
			var node;
			
			for (var i=0, length=this.layers.length; i<length; i++) {
				node = this.layers[i].hitTest(x, y);
				
				if (node) {
					return node;
				}
			}
		},
		
		invalidate: function () {
			this.context.save();
			this.context.setTransform(1, 0, 0, 1, 0, 0);
			this.context.clearRect(0, 0, this.width, this.height);
			this.context.restore();
	alert("!");
			for (var i=0, length=this.layers.length; i<length; i++) {
				this.context.drawImage(this.layers[i].canvas, -this.width, -this.height);
			}
		},
		
		capture: function () {
			var canvas = document.createElement("canvas"),
				context = canvas.getContext("2d"),
				width = this.width,
				height = this.height;
			
			canvas.width = width;
			canvas.height = height;
			
			context.transform(-width, -height);
			
			for (var i=0, length=this.layers.length; i<length; i++) {
				context.drawImage(this.layers[i].canvas, 0, 0);
			}
			
			return canvas.toDataURL();
		},
		
		on: function (type, handler) {
			var eventHandler = this.eventHandler;
			
			if (!eventHandler[type]) {
				eventHandler[type] = [];
			}
			
			eventHandler[type].push(handler);
		}
	};
	
})(window);

/**************************************************************************************************
 * Layer
 **************************************************************************************************/

function Layer() {
	this.init(arguments);
}

(function( window, undefined ) {
	
	Layer.prototype = {
		
		/**
		 * 
		 * @param {Array} args
		 * @param {Canvas} args[0] master canvas
		 */
		init: function (args) {
			/**
			 * @type {Canvas}
			 */
			this.master = args[0];
			this.canvas = document.createElement("canvas");
			this.hitCanvas = document.createElement("canvas");
			this.context = this.canvas.getContext("2d");
			this.hitContext = this.hitCanvas.getContext("2d");
			/**
			 * rgb string과 node 매핑
			 */
			this.hitData = new HitData();
			
			/**
			 * layer에 위치하는 node의 순서 
			 */
			this.index = [];
			
			this.scale = 1;
			this.width = 0;
			this.height = 0;
		},
		
		find: function (node) {
			var index = this.index.indexOf(node);
			
			if (index !== -1) {
				return this.index[index];
			}
		},
		
		/**
		 * master에게 layer가 변경되었음을 알려야함
		 * @param {Object} data
		 * @returns {Node} node 생성된 node
		 */
		add: function (data) {
			var node = new Node(this, data);
			
			node.id = this.hitData.add(node);
			
			this.index[this.index.length] = node;
			
			this.invalidate();
			
			this.master.invalidate();
			
			return node;
		},
		
		/**
		 * master에게 layer가 변경되었음을 알려야함
		 * @param {Node} node
		 * @returns {Node} node 삭제된 node
		 */
		remove: function (node) {
			var index = this.index.indexOf(node);
			
			if (index !== -1) {
				this.index.splice(index, 1);
				
				this.hitData.remove(node.id);
			
				this.invalidate();
				
				this.master.invalidate();
				
				return node;
			}
		},
		
		/**
		 * master로부터 호출 받으므로 알릴 필요 없음
		 * @param {Number} width
		 * @param {Number} height
		 */
		resize: function (width, height) {
			this.width = width;
			this.height = height;
			
			this.size();
		},
		
		size: function () {
			var width = this.width,
				height = this.height;
			
			this.canvas.width = width *3;
			this.canvas.height = height *3;
			
			this.hitCanvas.width = width;
			this.hitCanvas.height = height;
			
			this.transform();
		},
		
		bottom: function(node) {
			var index = this.index.indexOf(node);
			
			this.index.splice(index, 1);
			this.index.splice(0, 0, node);
			
			this.invalidate();
			
			this.master.invalidate();
		},
		
		top: function(node) {
			var index = this.index.indexOf(node);
			
			this.index.splice(index, 1);
			this.index[this.index.length] = node;
			
			this.invalidate();
			
			this.master.invalidate();
		},
		
		invalidate: function () {
			var nodes = this.index,
				length = nodes.length,
				node;
			
			this.clear();
		
			for (var i=0; i<length; i++) {
				node = nodes[i];
				
				this.hitContext.fillStyle = node.id;
				this.master.ondraw(this.context, this.hitContext, node.data);
			}
		},
		
		hitTest: function (x, y) {
			return this.hitData.get(this.hitContext.getImageData(x, y, 1, 1).data);
		},
		
		count: function () {
			return this.index.length;
		},
		
		transform: function () {console.log(this.scale);
			this.context.setTransform(this.scale, 0, 0, this.scale, Math.round(this.width *1.5), Math.round(this.height *1.5));
			this.hitContext.setTransform(this.scale, 0, 0, this.scale, Math.round(this.width *.5), Math.round(this.height *.5));
			
			this.invalidate();
		},
		
		clear: function () {
			this.context.save();
			this.context.setTransform(1, 0, 0, 1, 0, 0);
			this.context.clearRect(0, 0, this.width, this.height);
			this.context.restore();
	
			this.hitContext.save();
			this.hitContext.setTransform(1, 0, 0, 1, 0, 0);
			this.hitContext.clearRect(0, 0, this.width, this.height);
			this.hitContext.restore();
		},
		
		zoom: function (zoom) {
			this.scale = zoom;
			
			this.transform();
		}
		
	};
	
}) (window);

/**************************************************************************************************
 * Node
 **************************************************************************************************/

function Node () {
	this.init(arguments);
}

(function (window, undefined) {
	
	Node.prototype = {
			
		/**
		 * 
		 * @param {Array} args
		 * @param {Layer} args[0] layer
		 * @param {Object} args[1] node data
		 */
		init: function (args) {
			this.layer = args[0];
			this.data = args[1];
			this.id;
		}
	}
	
}) (window);

/**************************************************************************************************
 * HitData
 **************************************************************************************************/

function HitData () {
	this.init(arguments);
}

(function (window, undefined) {
	
	function toRGBString(n) {
		return "#"+ (1 << 24 | n).toString(16).substring(1);
	}
	
	HitData.prototype = {
		init: function (args) {
			this.map = {}
			this.index = 1;
		},
		
		/**
		 * @param {Node} node
		 * @return {String} key 16진수 color   
		 */
		add: function (node) {
			var key = toRGBString(this.index++);
			
			this.map[key] = node;
			
			return key;
		},
		
		/**
		 * @param {Array.<Number>} data [r, g, b, a]
		 * @returns {Node} node
		 */
		get: function (data) {
			var node;
			
			if (data.length === 4 && data[3] === 255) {
				node = this.map[toRGBString(data[0]<<16 | data[1]<<8 | data[2])];
			}
			
			return node;
		},
		
		/**
		 * @param {String} key 16진수 color
		 */
		remove: function (key) {
			delete this.map[key];
		}
	}
	
}) (window);

