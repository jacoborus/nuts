'use strict';

var renders = require('./renders.js'),
	doctypes = require('./doctypes.json'),
	newCounter = require('./loop.js').newCounter;

var newCounter = function (limit, callback) {
	var count = 0;
	return function (err) {
		if (err) { return callback( err );}
		if (++count === limit) {
			callback();
		}
	};
};

var voidElements = {
	area: true,
	base: true,
	br: true,
	col: true,
	embed: true,
	hr: true,
	img: true,
	input: true,
	keygen: true,
	link: true,
	meta: true,
	param: true,
	source: true,
	track: true,
	wbr: true,
	path: true,
	circle: true,
	ellipse: true,
	line: true,
	rect: true,
	use: true,
	stop: true,
	polyline: true,
	polygone: true
};


var text = function (next) {
	var out = this.data;
	this.render = function () {
		return out;
	};
	next();
};


var comment = function (next) {
	var out = '<!--' + this.data + '-->';
	this.render = function () {
		return out;
	};
	next();
};

var cdata = function (next) {
	var out = '<!' + this.data + '>';
	this.render = function () {
		return out;
	};
	next();
};

var directive = function (next) {
	var out = '<' + this.data + '>';
	this.render = function () {
		return out;
	};
	next();
};

var tag = function (next) {
	var self = this,
		start = '',
		end = '',
		i;

	if (this.doctype) {
		start += doctypes[ this.doctype ];
	}
	start += '<' + this.name;
	var attribs = this.attribs;
	if (attribs) {
		for (i in attribs) {
			start += ' ' + i + '="' + attribs[i] + '"';
		}
	}
	if (this.classes) {
		start += ' class="' + this.classes + '"';
	}
	if (!voidElements[this.name]) {
		start += '>';
		end = '</' + this.name + '>';

		if (this.children) {
			var len = this.children.length;
			var count = newCounter( len, function (err) {
				if (err) { return next( err );}
				if (typeof self.model !== 'undefined') {
					renders.renderModel( self, start, end, next );
				}  else {
					renders.renderNoModel( self, start, end, next );
				}
			});
			return this.children.forEach( function (child) {
				child.compile( count );
			});
		}

	} else {
		end = '>';
	}

	if (typeof this.model !== 'undefined') {
		renders.renderModel( this, start, end, next );
	}  else {
		renders.renderNoModel( this, start, end, next );
	}
};



module.exports = function (nut) {
	var compile;
	switch (nut.type) {
		case 'tag':
			compile = tag;
			break;
		case 'text':
			compile = text;
			break;
		case 'comment':
			if (nut.data.slice(0, 7) !== '[CDATA[') {
				compile = comment;
				break;
			}
			compile = cdata;
			break;

		case 'directive':
			compile = directive;
			break;
	}
	return compile;
};