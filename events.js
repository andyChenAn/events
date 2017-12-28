/**
 * 事件类
 */
function Events () {
	if (!(this instanceof Events)) {
		return new Events();
	};
	this.callbacks = {};
};

/**
 * 添加事件监听器
 * @param {string}   eventName 事件名
 * @param {function} callback  事件监听器
 */
Events.prototype.addListener = function (eventName , callback) {
	this.callbacks[eventName] = this.callbacks[eventName] || [];
	this.callbacks[eventName].push(callback);
	return this;
};

/* 别名 */
Events.prototype.on = Events.prototype.addListener;

/**
 * 删除一个或多个事件监听器
 *
 * 如果不存在eventName，那么就删除所有的监听器
 * 如果eventName存在，不存在callback，那么就删除该eventName下的所有监听器
 * 如果eventName存在，callback也存在，那么就删除该eventName下指定的监听器
 * 
 * @param  {string}   eventName 事件名
 * @param  {function} callback  事件回调函数
 * 
 */
Events.prototype.removeListener = function (eventName , callback) {
	let callbacks = this.callbacks;
	if (!eventName) {          /* 如果事件名不存在，那么就删除所有的监听器 */
		callbacks = {};
	} else {                   
		if (!callback) {       /* 如果事件名存在，但是不存在callback，那么就删除该eventName下的所有监听器 */
			callbacks[eventName] = [];
		} else {                               /* 删除指定的监听器 */
			let list = callbacks[eventName];
			if (list) {
				for (let i = 0 ; i < list.length ; i++) {
					if (callback === list[i]) {
						list[i] = null;

					}
				}
			}
		}
	};
	return this;
};
Events.prototype.off = Events.prototype.removeListener;

/**
 * 触发事件
 * @param  {string} eventName 事件名
 * @param  {any} data      事件触发时传递的数据
 */
Events.prototype.trigger = function (eventName , data) {
	let callbacks = this.callbacks[eventName];
	if (callbacks) {
		for (let i = 0 ; i < callbacks.length ; i++) {
			if (!callbacks[i]) {
				callbacks.splice(i , 1);
				i--;   //因为你这里已经删除掉了数组中的一个元素，所以这里需要-1
			} else {
				callbacks[i].call(this , data);
			}
		}
	}
};
Events.prototype.emit = Events.prototype.trigger;

/**
 * 删除eventName下的所有监听器
 * @param  {string} eventName 事件名
 */
Events.prototype.removeAllListeners = function (eventName) {
	return this.removeListener(eventName);
};
Events.prototype.offAll = Events.prototype.removeAllListeners;

/**
 * 通过once来绑定事件，那么多次触发该事件，该事件的监听器只会执行一次
 * 
 * 绑定一次事件监听器
 * @param  {string}   eventName 事件名
 * @param  {function} callback  事件监听器
 */
Events.prototype.once = function (eventName , callback) {
	let self = this;
	let onceWrapper = function () {
		callback.apply(self , arguments);
		self.removeListener(eventName , onceWrapper);
	};
	return this.addListener(eventName , onceWrapper);
};