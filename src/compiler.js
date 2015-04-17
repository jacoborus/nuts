'use strict';

var doctypes = require('./doctypes.json'),
	//setRenders = require('./renders.js'),
	newCounter = require('./loop.js').newCounter;


var text = function (next) {
	this.out = this.data;
	this.render = function (x, next, i) {
		next( this.out, i );
	};
	next();
};


var comment = function (next) {
	this.out = '<!--' + this.data + '-->';
	this.render = function (x, next, i) {
		next( this.out, i );
	};
	next();
};

var cdata = function (next) {
	this.out = '<!' + this.data + '>';
	this.render = function (x, next, i) {
		next( this.out, i );
	};
	next();
};

var directive = function (next) {
	this.out = '<' + this.data + '>';
	this.render = function (x, next, i) {
		next( this.out, i );
	};
	next();
};


var tag = function (next) {
	this.start = '';
	this.end = '';
	var self = this, i;
	var renders = this.renders;

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
		}
	}

	if (this.scope) {
		this.addRenderScope();
	}

	if (this.nuif) {
		this.render = this.renderNuif;
	} else {
		this.render = this.renderNoNuif;
	}

	if (this.nuAtts) {
		this.addRenderNuAtts();
	}

	if (this.nuClass) {
		this.addRenderNuClass();
	}

	if (this.nuSakes) {
		this.addRenderNamesakes();
	}

	if (!this.voidElement) {
		this.end = '</' + this.name + '>';

		if (typeof this.model !== 'undefined') {
			if (this.model === '') {
				this.addRenderFullModel();
			} else {
				this.addRenderPartialModel();
			}
		} else {
			if (this.children) {
				this.renders.push( this.getPrintChildren( ));
			} else {
				this.renders.push( function (out, x, next) {
					next( out + '>' );
				});
			}
		}

		if (this.children) {

			var count = newCounter( this.children.length, function () {
				next();
			});

			return this.children.forEach( function (child) {
				child.compile( count );
			});

		}
	} else {
		this.renders.push( function (out, x, next) {
			next( out + '>' );
		});
	}
	next();
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