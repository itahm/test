; "use strict";

function Draggable(container) {
	var eventHandler = {},
		isDragging = false,
		event;
	
	container.addEventListener("mousedown", function (e) {
		if (e.button !== 0) {
			return;
		}
		
		var x = e.clientX,
			y = e.clientY;
		
		event = {
			x: x,
			y: y,
		};
	}, false);
	
	container.addEventListener("mousemove", function (e) {
		if (!event) {
			return;
		}
		
		var x = e.clientX,
			y = e.clientY,
			lastX = event.lastX || event.x,
			lastY = event.lastY || event.y;
		
		if (lastX === x && lastY === y) {
			return;
		}
		
		if (!isDragging) {
			fireEvent("dragstart");
			
			isDragging = true;
		}
		
		event.dragX = x - event.x;
		event.dragY = y - event.y;
		event.moveX = x - lastX;
		event.moveY = y - lastY;
		event.lastX = x;
		event.lastY = y;
		
		fireEvent("dragmove");
	}, false);
	
	container.addEventListener("mouseup", onDragEnd, false);
	container.addEventListener("mouseout", onDragEnd, false);
	
	function onDragEnd(e) {
		event = undefined;
		
		if (!isDragging) {
			return;
		}
		
		fireEvent("dragend");
		
		isDragging = false;
	}
	
	function fireEvent(name) {
		var handler = eventHandler[name],
			index, length;
		
		if (handler) {
			for (var i=0, _i=handler.length; i<_i; i++) {
				handler[i](event);
			}
		}
	}
	
	this.on = function (type, callback) {
		var handler = eventHandler[type];
		
		if (!handler) {
			eventHandler[type] = handler = [];
		}
		
		handler[handler.length] = callback;
		
		return this;
	};
};