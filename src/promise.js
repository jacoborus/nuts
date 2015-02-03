'use strict';

var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;
function getParamNames(func) {
  var fnStr = func.toString().replace(STRIP_COMMENTS, '');
  var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  if(result === null)
     result = [];
  return result;
}

var Prom = function () {
	this.fns = [];

	var self = this;
	this.next = function (err) {

		if (err) {
			if (self.finalFn) {
				return self.finalFn( err );
			}
			throw err;
		}

		var fn = self.fns.shift();
		if (fn) {
			fn( self );
		} else if (self.finalFn) {
			self.finalFn();
		}
	};
};


Prom.create = function (instance, methods) {
	methods.forEach( function (method) {
		var prototype = Object.getPrototypeOf( instance ),
			oldMethod = prototype[method];

		prototype[method] = function (x, callback, promise) {
			promise = promise || new Prom();
			var next = callback || promise.next;
			return promise.enqueue( function () {
				oldMethod.call( instance, x, next );
			}, callback );
		};

		Prom.prototype[method] = function (x, callback) {
			return instance[method].call( instance, x, callback, this );
		};

	});
};


Prom.prototype.enqueue = function (fn, now) {
	if (now) {
		return fn();
	}
	this.fns.push(fn);
	return this;

};

Prom.prototype.exec = function (fn) {
	this.finalFn = fn;
	this.next();
};

module.exports = Prom;
