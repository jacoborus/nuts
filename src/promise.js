'use strict';

var Prom = function (fn) {
	this.fns = [];
	if (fn) {
		this.enqueue( fn );
	}
};

Prom.create = function (name, parent, method) {
	Prom.prototype[name] = function (x) {
		var self = this;
		this.enqueue( function () {
			method( x, self, parent );
		});
		return this;
	};
};


Prom.prototype.next = function (err) {
	var fn = this.fns.shift();

	if (err) {
		if (this.finalFn) {
			return this.finalFn(err);
		}
		throw err;
	}

	if (fn) {
		return fn( this );
	} else if (this.finalFn) {
		this.finalFn();
	}
};

Prom.prototype.enqueue = function (fn) {
	this.fns.push(fn);
};

Prom.prototype.exec = function (fn) {
	this.finalFn = fn;
	this.next();
};

module.exports = Prom;
