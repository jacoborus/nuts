'use strict';

var doctypes = require('./doctypes.json'),
	renders = require('./renders.js'),
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


var getRenderLink = function (fn, next, props) {
	var r = {},
		i;

	for (i in props) {
		r[i] = props[i];
	}
	r.render = fn;
	r.next = next;

	return r;
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




var renderChildren = function (children, out, x, next, cb, pos) {
	var count = childrenCounter( children.length, function (html) {
		next.render( out + '>' + html, undefined, cb, pos );
	});
	children.forEach( function (child, i) {
		child.render( x, count, i );
	});
};



var renderRepeat = function (render, out, x, cb, pos) {
	var count = childrenCounter( x.length, function (html) {
		cb( out + html, pos );
	});
	x.forEach( function (y, i) {
		render.render( '', y, count, i );
	});
};


var tag = function (next) {
	var render;
	this.start = '<' + this.name;
	this.end = '<' + this.name;
	var tagEnd =  '</' + this.name + '>';

	if (this.voidElement) {
		render = {
			render: function (out, x, cb, pos) {
				cb( out + '>', pos );
			}
		};
	} else {
		render = {
			render: function (out, x, cb, pos) {
				cb( out + tagEnd, pos );
			}
		};
		if (typeof this.model !== 'undefined') {
			if (!this.children) { // model, no children
				render = getRenderLink( renders.modelNoChildren, render, {
					model: this.model
				});
			} else { // model, children
				render = getRenderLink( renders.modelChildren, render, {
					model: this.model,
					children: this.children,
					renderChildren: renderChildren
				});
			}
		} else if (this.children) { // no model, children
			render = getRenderLink( renders.NoModelChildren, render, {
				children: this.children,
				renderChildren: renderChildren
			});
		} else { // no model, no children
			render = getRenderLink( renders.noModelNoChildren, render, {});
		}

		if (this.nuSakes) {
			render = getRenderLink( renders.nuSakes, render, {
				nuSakes: this.nuSakes,
				namesakes: this.namesakes
			});
		}

		if (this.nuClass) {
			render = getRenderLink( renders.nuClass, render, {
				nuClass: this.nuClass,
				classes: this.classes || ''
			});
		}

		if (this.nuAtts) {
			render = getRenderLink( renders.nuAtts, render, { nuAtts : this.nuAtts });
		}

		if (this.attribs) {
			render = getRenderLink( renders.attribs, render, { attribs: this.attribs });
		}
	}


	if (this.doctype) {
		render = getRenderLink( renders.doctype, render, { out: doctypes[ this.doctype ] + this.start });
	} else {
		render = getRenderLink( renders.noDoctype, render, { start: this.start	});
	}


	if (this.nuif) {
		render = getRenderLink( renders.nuif, render, { nuif: this.nuif });
	}


	if (typeof this.repeat !== 'undefined') {
		if (this.repeat) {
			render = getRenderLink( renders.repeatAll, render, {
				repeat: this.repeat,
				renderRepeat: renderRepeat
			});
		} else {
			render = getRenderLink( renders.repeatPart, render, { renderRepeat: renderRepeat });
		}
	}


	if (this.scope) {
		render = getRenderLink( renders.scope, render, { scope: this.scope });
	}

	this.renders = render;

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