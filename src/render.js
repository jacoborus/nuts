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

renders.addRenderNuifScope = function () {
	var nuif = this.nuif;
	this.renders.push( function (out, x, next) {
		if (x[nuif]) {
			next( out, x );
		} else {
			next();
		}
	});
};

renders.addRenderNuifNoScope = function () {
	this.renders.push( function (out, x, next) {
		if (x) {
			next( out, x );
		} else {
			next();
		}
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

renders.addRenderNamesakes = function () {
	var nusakes = this.nuSakes,
		namesakes = this.namesakes;
	this.renders.push( function (out, x, next) {
		var i;
		for (i in nusakes) {
			if (typeof x[nusakes[i]] !== 'undefined') {
				out += ' ' + i + '="' + x[nusakes[i]] + '"';
			} else {
				out += ' ' + i + '="' + namesakes[i] + '"';
			}
		}
		next( out, x );
	});
};


renders.addRenderNuClass = function () {
	var nuClass = this.nuClass,
		classes = this.classes ? this.classes + ' ': '',
		pre = ' class="' + classes;

	this.renders.push( function (out, x, next) {
		if (typeof x[nuClass] !== 'undefined') {
			out += pre + x[nuClass];
		} else {
			out += pre;
		}
		next( out + '"', x );
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

module.exports = renders;

