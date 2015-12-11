; "use strict";

function Draggable(target) {
	var isDragging = false,
		originX, originY,
		lastX, lastY,
		draggable;
	
	function onMouseDown(e) {
		if (e.button !== 0) {
			return;
		}
		
		originX = lastX = e.clientX;
		originY = lastY = e.clientY;
		
		draggable = e.target;
	}
	
	function onMouseMove(e) {
		if (!draggable || lastX === x && lastY === y) {
			return;
		}
		
		var x = e.clientX,
			y = e.clientY,
			data;
			
		if (!isDragging) {
			data = {
				target: draggable
			};
			
			target.dispatchEvent(createEvent("dragstart", data));
			
			isDragging = true;
		}
		
		data = {
			target: draggable,
			dragX: x - originX,
			dragY: y - originY,
			moveX: x - lastX,
			moveY: y - lastY
		};
		
		lastX = x;
		lastY = y;
		
		target.dispatchEvent(createEvent("dragmove", data));
	}
	
	function onMouseUp(e) {
		var x = e.clientX,
			y = e.clientY,
			data = {
				target: draggable,
				dragX: x - originX,
				dragY: y - originY,
				moveX: x - lastX,
				moveY: y - lastY
			};
		
		draggable = undefined;
		
		if (!isDragging) {
			return;
		}
		
		target.dispatchEvent(createEvent("dragend", data));
		
		isDragging = false;
	}
	
	function initEvent() {
		target.addEventListener("mousedown", onMouseDown, false);
		target.addEventListener("mousemove", onMouseMove, false);
		target.addEventListener("mouseup", onMouseUp, false);
	}
	
	function createEvent(type, data) {
		var event = document.createEvent("CustomEvent", true, true);
		
		event.initCustomEvent(type, true, true, data || null);
		
		return event;
	}
	
	initEvent();
};