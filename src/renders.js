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

renders.scope = function (out, x, cb, pos) {
	this.next.render( '', x[ this.scope ], cb, pos );
};


renders.repeatAll = function (out, x, cb, pos) {
	var y = x[ this.repeat ];
	this.renderRepeat( this.next, out, y, cb, pos );
};

renders.repeatPart = function (out, x, cb, pos) {
	this.renderRepeat( this.next, out, x, cb, pos );
};


renders.nuif = function (out, x, cb, pos) {
	if (x[ this.nuif ]) {
		this.next.render( out, x, cb, pos );
	} else {
		cb( out, pos );
	}
};


renders.doctype = function (out, x, cb, pos) {
	// add doctype to string
	this.next.render( this.out , x, cb, pos );
};

renders.noDoctype = function (out, x, cb, pos) {
	this.next.render( this.start, x, cb, pos );
};


renders.attribs = function (out, x, cb, pos) {
	var i;
	for (i in this.attribs) {
		out += ' ' + i + '="' + this.attribs[i] + '"';
	}
	this.next.render( out, x, cb, pos );
};


renders.nuAtts = function (out, x, cb, pos) {
	var i;
	for (i in this.nuAtts) {
		if (typeof this.nuAtts[i] !== 'undefined') {
			out += ' ' + i + '="' + x[this.nuAtts[i]] + '"';
		}
	}
	this.next.render( out, x, cb, pos );
};

renders.nuClass = function (out, x, cb, pos) {
	var pre = ' class="';
	if (typeof x[this.nuClass] !== 'undefined') {
		if (this.classes) {
			out += pre + this.classes + ' ' + x[this.nuClass] + '"';
		} else {
			out += pre + x[this.nuClass] + '"';
		}
	} else {
		if (this.classes) {
			out += pre + this.classes + '"';
		}
	}
	this.next.render( out, x, cb, pos );
};

renders.nuSakes = function (out, x, cb, pos) {
	var i;
	for (i in this.nuSakes) {
		if (typeof x[this.nuSakes[i]] !== 'undefined') {
			out += ' ' + i + '="' + x[this.nuSakes[i]] + '"';
		} else {
			out += ' ' + i + '="' + this.namesakes[i] + '"';
		}
	}
	this.next.render( out, x, cb, pos );
};


renders.modelChildren = function (out, x, cb, pos) {
	if (typeof x[this.model] !== 'undefined') {
		this.next.render( out + x[ this.model ], undefined, cb, pos );
	} else {
		this.renderChildren( this.children, out, x, this.next, cb, pos );
	}
};

renders.modelNoChildren = function (out, x, cb, pos) {
	if (this.model === '') {
		this.next.render( out + x, undefined, cb, pos );
	} else {
		if (typeof x[this.model] !== 'undefined') {
			this.next.render( out + x[ this.model ], undefined, cb, pos );
		} else {
			this.next.render( out, undefined, cb, pos );
		}
	}
};

renders.noModelNoChildren = function (out, x, cb, pos) {
	this.next.render( out + '>', x, cb, pos );
};

renders.NoModelChildren = function (out, x, cb, pos) {
	this.renderChildren( this.children, out, x, this.next, cb, pos );
};


renders.renderChildren = function (children, out, x, next, cb, pos) {
	var count = childrenCounter( children.length, function (html) {
		next.render( out + html, undefined, cb, pos );
	});
	children.forEach( function (child, i) {
		child.render( x, count, i );
	});
};


renders.renderRepeat = function (render, out, x, cb, pos) {
	var count = childrenCounter( x.length, function (html) {
		cb( out + html, pos );
	});
	x.forEach( function (y, i) {
		render.render( '', y, count, i );
	});
};

renders.modelChildrenEach = function (out, x, cb, pos) {
	if (typeof x[this.model] !== 'undefined') {
		this.next.render( out + x[ this.model ], undefined, cb, pos );
	} else {
		this.renderChildren( this.children, out, x, this.next, cb, pos );
	}
};

renders.NoModelChildrenEach = function (out, x, cb, pos) {
	var children = this.children,
		renderChildren = this.renderChildren,
		tagEnd = this.tagEnd,
		count = childrenCounter( x.length, function (html) {
			cb( out + html + tagEnd, pos );
		});

	x.forEach( function (y, i) {
		renderChildren( children, '', y, {
			render: function (html) {
				count( html , i );
			},
		},
		count, i );
	});
};
/*
renders.NoModelChildren = function (out, x, cb, pos) {
	this.renderChildren( this.children, out, x, this.next, cb, pos );
};
*/

module.exports = renders;

