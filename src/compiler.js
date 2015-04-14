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


var text = function () {
	var out = this.data;
	return function () {
		return out;
	};
};


var comment = function () {
	var out = '<!--' + this.data + '-->';
	return function () {
		return out;
	};
};

var cdata = function () {
	var out = '<!' + this.data + '>';
	return function () {
		return out;
	};
};

var directive = function () {
	var out = '<' + this.data + '>';
	return function () {
		return out;
	};
};

var tag = function () {
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

		if (this.children) {
			this.children.forEach( function (child) {
				child.render = child.compile( child );
			});
		}

		end = '</' + this.name + '>';
	} else {
		end = '>';
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


module.exports = function (schema) {
	var compile;
	switch (schema.type) {
		case 'tag':
			compile = tag;
			break;
		case 'text':
			compile = text;
			break;
		case 'comment':
			if (schema.data.slice(0, 7) !== '[CDATA[') {
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