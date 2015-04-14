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
	this.start = '';
	var self = this,
		i;

	if (this.doctype) {
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
		this.start += ' class="' + this.classes + '"';
	}
	if (!this.voidElement) {
		this.start += '>';
		this.end = '</' + this.name + '>';

		if (this.children) {
			var len = this.children.length;
			var count = newCounter( len, function (err) {
				if (err) { return next( err );}
				if (typeof self.model !== 'undefined') {
					renders.renderModel( self, next );
				}  else {
					renders.renderNoModel( self, next );
				}
			});
			return this.children.forEach( function (child) {
				child.compile( count );
			});
		}

	} else {
		this.end = '>';
	}

	if (typeof this.model !== 'undefined') {
		renders.renderModel( this, next );
	}  else {
		renders.renderNoModel( this, next );
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