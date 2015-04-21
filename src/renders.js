'use strict';

var childrenCounter = function (limit, callback) {
	var count = 0,
		res = [];

	return function (text, i) {
		res[i] = text;
		if (++count === limit) {
			callback( res.join( '' ));
		}
	};
};



var renders = {};


renders.renderChildren = function (children, out, x, next, cb, pos) {
	var count = childrenCounter( children.length, function (text) {
		next.render( out + text, x, cb, pos );
	});
	children.forEach( function (child, i) {
		child.render( x, count, i );
	});
};


renders.renderRepeat = function (render, out, x, cb, pos) {
	var count = childrenCounter( x.length, function (text) {
		cb( out + text, pos );
	});
	x.forEach( function (y, i) {
		render.render( '', y, count, i );
	});
};


renders.inheritFull = function (out, x, cb, pos) {
	var pre = {},
		i;

	for (i in x) {
		pre[i] = x[i];
	}

	if (x[this.scope]) {
		x = x[this.scope];
	} else {
		x = {};
	}

	for (i in pre) {
		x[i] = pre[i];
	}

	this.next.render( '', x, cb, pos );
};

renders.inheritPart = function (out, x, cb, pos) {
	var pre = {},
		props, i;

	props = this.inherit.split(' ');
	for (i in props) {
		pre[props[i]] = x[props[i]];
	}

	if (x[this.scope]) {
		x = x[this.scope];
	} else {
		x = {};
	}

	for (i in pre) {
		x[i] = pre[i];
	}

	this.next.render( '', x, cb, pos );
};


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


renders.modelNoChildren = function (out, x, cb, pos) {
	if (this.model === '') {
		this.next.render( out + x, x, cb, pos );
	} else {
		if (typeof x[this.model] !== 'undefined') {
			this.next.render( out + x[ this.model ], x, cb, pos );
		} else {
			this.next.render( out, x, cb, pos );
		}
	}
};

renders.noModelNoChildren = function (out, x, cb, pos) {
	this.next.render( out + '>', x, cb, pos );
};

renders.NoModelChildren = function (out, x, cb, pos) {
	this.renderChildren( this.children, out, x, this.next, cb, pos );
};

renders.modelChildren = function (out, x, cb, pos) {
	if (typeof x[this.model] !== 'undefined') {
		this.next.render( out + x[ this.model ], x, cb, pos );
	} else {
		this.renderChildren( this.children, out, x, this.next, cb, pos );
	}
};

renders.modelChildrenEachFull = function (out, x, cb, pos) {
	if (typeof x[this.model] !== 'undefined') {
		return this.next.render( out + x[ this.model ], x, cb, pos );
	}
	var children = this.children,
		renderChildren = this.renderChildren,
		tagEnd = this.tagEnd,
		count = childrenCounter( x.length, function (text) {
			cb( out + text + tagEnd, pos );
		});

	x.forEach( function (y, i) {
		renderChildren( children, '', y, {
			render: function (text) {
				count( text , i );
			},
		},
		count, i );
	});
};


renders.modelChildrenEachPart = function (out, x, cb, pos) {
	if (typeof x[this.model] !== 'undefined') {
		return this.next.render( out + x[ this.model ], x, cb, pos );
	}
	var y = x[this.each];

	if (!Array.isArray( y )) {
		return cb( out + this.tagEnd, pos );
	}
	var children = this.children,
		renderChildren = this.renderChildren,
		tagEnd = this.tagEnd,
		count = childrenCounter( y.length, function (text) {
			cb( out + text + tagEnd, pos );
		});

	y.forEach( function (z, i) {
		renderChildren( children, '', z, {
			render: function (text) {
				count( text , i );
			},
		},
		count, i );
	});
};
renders.NoModelChildrenEachFull = function (out, x, cb, pos) {
	var children = this.children,
		renderChildren = this.renderChildren,
		tagEnd = this.tagEnd,
		count = childrenCounter( x.length, function (text) {
			cb( out + text + tagEnd, pos );
		});

	x.forEach( function (y, i) {
		renderChildren( children, '', y, {
			render: function (text) {
				count( text , i );
			},
		},
		count, i );
	});
};

renders.NoModelChildrenEachPart = function (out, x, cb, pos) {
	var y = x[this.each];

	if (!Array.isArray( y )) {
		return cb( out + this.tagEnd, pos );
	}
	var children = this.children,
		renderChildren = this.renderChildren,
		tagEnd = this.tagEnd,
		count = childrenCounter( y.length, function (text) {
			cb( out + text + tagEnd, pos );
		});

	y.forEach( function (z, i) {
		renderChildren( children, '', z, {
			render: function (text) {
				count( text , i );
			},
		},
		count, i );
	});
};


module.exports = renders;

