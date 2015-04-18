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


var getRender = function (renders, n, fn) {
	return function (out, x) {
		fn( out, x, renders[ --n ]);
	};
};


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


var renderChildren = function (children, out, x, next) {
	var count = childrenCounter( children.length, function (html) {
		next( out + '>' + html );
	});
	children.forEach( function (child, i) {
		child.render( x, count, i );
	});
};

var tag = function (next) {
	var n = 1,
		model = this.model,
		start = '<' + this.name,
		children = this.children,
		doctype = this.doctype,
		attribs = this.attribs,
		scope = this.scope,
		nuAtts = this.nuAtts,
		nuSakes = this.nuSakes,
		namesakes = this.namesakes;

	if (!this.voidElement) {
		if (this.model || this.model === '') {
			if (!this.children) {
				this.renders[n] = getRender( this.renders, n++, function (out, x, next) {
					if (typeof x[model] !== 'undefined') {
						next( out + '>' + x[ model ]);
					} else {
						next( out + '>' );
					}
				});
			} else {
				this.renders[n] = getRender( this.renders, n++, function (out, x, next) {
					if (typeof x[model] !== 'undefined') {
						next( out + '>' + x[ model ]);
					} else {
						renderChildren( children, out, x, next );
					}
				});
			}
		} else if (this.children) {
			this.renders[ n ] = getRender( this.renders, n++, function (out, x, next) {
				renderChildren( children, out, x, next );
			});
		} else {
			this.renders[ n ] = getRender( this.renders, n++, function (out, x, next) {
				next( out + '>' );
			});
		}


		if (this.nuAtts) {
			this.renders[ n ] = getRender( this.renders, n++, function (out, x, next) {
				var i;
				for (i in nuAtts) {
					if (typeof nuAtts[i] !== 'undefined') {
						out += ' ' + i + '="' + x[nuAtts[i]] + '"';
					}
				}
				next( out, x );
			});
		}


		if (this.attribs) {
			this.renders[ n ] = getRender( this.renders, n++, function (out, x, next) {
				var i;
				for (i in attribs) {
					out += ' ' + i + '="' + attribs[i] + '"';
				}
				next( out, x );
			});
		}
	}


	if (this.doctype) {
		this.renders[ n ] = getRender( this.renders, n++, function (out, x, next) {
			// add doctype to string
			next( doctypes[ doctype ] + start, x );
		});
	} else {
		this.renders[ n ] = getRender( this.renders, n++, function (out, x, next) {
			next( start, x );
		});
	}

	if (this.scope) {
		this.renders[ n ] = getRender( this.renders, n++, function (out, x, next) {
			next( '', x[ scope ]);
		});
	}

	// compile children
	if (this.children) {
		var count = newCounter( this.children.length, next );
		this.children.forEach( function (child) {
			child.compile( count );
		});
	} else {
		next();
	}
};

/*
	if (this.scope) {
		this.addRenderScope();
	}

	if (this.nuif) {
		this.render = this.renderNuif;
	} else {
		if (typeof this.repeat !== 'undefined') {
			if (this.repeat === '') {
				this.render = this.renderNoNuifLoopScope;
			} else  {
				this.render = this.renderNoNuifLoopField;
			}
		}  else {
			this.render = this.renderNoNuif;
		}
	}

	if (this.nuClass) {
		this.addRenderNuClass();
	}

	if (this.nuSakes) {
		this.addRenderNamesakes();
	}
*/



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