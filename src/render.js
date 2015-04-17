'use strict';

var childrenCounter = function (limit, callback) {
	var count = 0,
		res = [];

	return function (html, i) {
		res[i] = html;
		if (++count === limit) {
			callback( res.join( '' ));
		}
	};
};

var renders = {};

renders.addRenderScope = function () {
	var scope = this.scope;
	this.renders.push( function (out, x, next) {
		next( out, x[scope] );
	});
};

renders.addRenderNuAtts = function () {
	var atts = this.nuAtts;
	this.renders.push( function (out, x, next) {
		var i;
		for (i in atts) {
			if (typeof atts[i] !== 'undefined') {
				out += ' ' + i + '="' + x[atts[i]] + '"';
			}
		}
		next( out, x );
	});
};


renders.addRenderFullModel = function () {
	var end = this.end;
	this.renders.push( function (out, x, next) {
		next( out + '>' + x + end );
	});
};


renders.addRenderPartialModel = function () {
	var model = this.model,
		self = this;

	if (this.children) {
		this.renders.push( function (out, x, next) {
			if (typeof x[model] !== 'undefined'){
				next( out + '>' + x[model] );
			} else {
				self.getPrintChildren()( out, x, next );
			}
		});
	} else {
		this.renders.push( function (out, x, next) {
			if (typeof x[model] !== 'undefined'){
				return next( out + '>' + x[model] );
			}
			next( out );
		});
	}
};

renders.getPrintChildren = function () {
	var children = this.children;
	return function (start, x, next) {
		var count = childrenCounter( children.length, function (out) {
			next( start + '>' + out, x );
		});
		children.forEach( function (child, i) {
			child.render( x, count, i );
		});
	};
};

module.exports = renders