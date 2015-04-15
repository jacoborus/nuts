'use strict';

var setRenders = require('./renders.js'),
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

var text = function (next) {
	this.out = this.data;
	this.render = function () {
		return this.out;
	};
	next();
};


var comment = function (next) {
	this.out = '<!--' + this.data + '-->';
	this.render = function () {
		return this.out;
	};
	next();
};

var cdata = function (next) {
	this.out = '<!' + this.data + '>';
	this.render = function () {
		return this.out;
	};
	next();
};

var directive = function (next) {
	this.out = '<' + this.data + '>';
	this.render = function () {
		return this.out;
	};
	next();
};


var tag = function (next) {
	this.start = '';
	this.end = '';
	var self = this, i;

	if (this.doctype) {
		// add doctype to string
		this.start += doctypes[ this.doctype ];
	}

	this.start += '<' + this.name;

	var attribs = this.attribs;
	if (attribs) {
		for (i in attribs) {
			this.start += ' ' + i + '="' + attribs[i] + '"';
		}
	}

	if (this.classes) {
		if (!this.nuClass) {
			this.start += ' class="' + this.classes + '"';
		} else {
			this.start += ' class="' + this.classes;
		}
	}

	if (!this.voidElement) {
		this.end = '</' + this.name + '>';

		if (this.children) {
			var count = newCounter( this.children.length, function (err) {
				if (err) { return next( err );}
				setRenders( self, next );
			});

			return this.children.forEach( function (child) {
				child.compile( count );
			});
		}

	}
	setRenders( this, next );
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