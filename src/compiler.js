'use strict';

var doctypes = require('./doctypes.json');

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


var compiler = {};

compiler.text = function () {
	var out = this.schema.data;
	return function () {
		return out;
	};
};


compiler.comment = function () {
	var out = '<!--' + this.schema.data + '-->';
	return function () {
		return out;
	};
};

compiler.cdata = function () {
	var out = '<!' + this.schema.data + '>';
	return function () {
		return out;
	};
};

compiler.directive = function () {
	var out = '<' + this.schema.data + '>';
	return function () {
		return out;
	};
};

compiler.tag = function () {
	var i;
	var self = this;
	var start = '';
	if (this.schema.doctype) {
		start += doctypes[ this.schema.doctype ];
	}
	start += '<' + this.schema.name;
	var attribs = this.schema.attribs;
	if (attribs) {
		for (i in attribs) {
			start += ' ' + i + '="' + attribs[i] + '"';
		}
	}
	if (this.schema.classes) {
		start += ' class="' + this.schema.classes + '"';
	}
	if (!voidElements[this.schema.name]) {
		start += '>';

		if (this.children) {
			this.children.forEach( function (child) {
				child.render = child.compile( child );
			});
		}

		var end = '</' + this.schema.name + '>';
	} else {
		var end = '>';
	}


	return function () {
		var out = start;
		if (self.children) {
			self.children.forEach( function (child) {
				out += child.render();
			});
		}
		return out + end;
	};
};

module.exports = compiler;