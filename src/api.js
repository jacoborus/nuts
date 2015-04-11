'use strict';


var serie = function (target, fns, callback) {
	callback = callback || function (err) {
		if (err) { throw err;}
	};
	var error = false;
	if (target.errors.length) {
		//throw new Error( target.errors[0])
		return callback( new Error( target.errors[0] ));
	}
	var next = function (err) {
		if (err) { return callback( err );}
		if (!fns.length) {
			return callback();
		}
		fns.shift()( next );
	};
	next();
};


// nuts constructor
var Nuts = function () {
	this.Nuts = Nuts;
	this.promises = [];
	this.errors = [];
};

Nuts.prototype.then = function (fn) {
	if (typeof fn !== 'function') {
		this.errors.push( 'nuts.then requires a function as param' );
		return this;
	}
	this.promises.push( fn );
	return this;
};

Nuts.prototype.exec = function (callback) {
	callback = callback || function () {};
	var fns = this.promises.slice();
	this.promises = [];
	serie( this, fns, callback );
};




module.exports = new Nuts();
