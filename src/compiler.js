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


var getRenderLink = function (props, fn, next) {
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


var renderChildren = function (children, out, x, next, cb) {
	var count = childrenCounter( children.length, function (html) {
		next.render( out + '>' + html, undefined, cb );
	});
	children.forEach( function (child, i) {
		child.render( x, count, i );
	});
};

var tag = function (next) {
	var render;
	this.start = '<' + this.name;
	this.end = '<' + this.name;
	var tagEnd =  '</' + this.name + '>';

	if (this.voidElement) {
		render = {
			render: function (out, x, cb) {
				cb( out + '>', cb.i );
			}
		};
	} else {
		render = {
			render: function (out, x, cb) {
				cb( out + tagEnd, cb.i );
			}
		};
		if (this.model || this.model === '') {
			if (!this.children) {
				render = getRenderLink(
					{ model: this.model	},
					function (out, x, cb) {
						if (typeof x[this.model] !== 'undefined') {
							this.next.render( out + '>' + x[ this.model ], undefined, cb);
						} else {
							this.next.render( out + '>', 'undefined', cb );
						}
					},
					render
				);
			} else {
				render = getRenderLink(
					{
						model: this.model,
						children: this.children,
						renderChildren: renderChildren
					},
					function (out, x, cb) {
						if (typeof x[this.model] !== 'undefined') {
							this.next.render( out + '>' + x[ this.model ], undefined, cb );
						} else {
							this.renderChildren( this.children, out, x, this.next, cb );
						}
					},
					render
				);
			}
		} else if (this.children) {
			render = getRenderLink(
				{
					children: this.children,
					renderChildren: renderChildren
				},
				function (out, x, cb) {
					this.renderChildren( this.children, out, x, this.next, cb );
				},
				render
			);
		} else { // no model, no children
			render = getRenderLink({}, function (out, x, cb) {
				this.next.render( out + '>', undefined, cb );
			}, render);
		}

		if (this.nuSakes) {
			render = getRenderLink(
				{
					nuSakes: this.nuSakes,
					namesakes: this.namesakes
				},
				function (out, x, cb) {
					var i;
					for (i in this.nuSakes) {
						if (typeof x[this.nuSakes[i]] !== 'undefined') {
							out += ' ' + i + '="' + x[this.nuSakes[i]] + '"';
						} else {
							out += ' ' + i + '="' + this.namesakes[i] + '"';
						}
					}
					this.next.render( out, x, cb );
				},
				render
			);
		}


		if (this.nuClass) {
			render = getRenderLink(
				{
					nuClass: this.nuClass,
					classes: this.classes || ''
				},
				function (out, x, cb) {
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
					this.next.render( out, x, cb );
				},
				render
			);
		}


		if (this.nuAtts) {
			render = getRenderLink(
				{
					nuAtts : this.nuAtts
				},
				function (out, x, cb) {
					var i;
					for (i in this.nuAtts) {
						if (typeof this.nuAtts[i] !== 'undefined') {
							out += ' ' + i + '="' + x[this.nuAtts[i]] + '"';
						}
					}
					this.next.render( out, x, cb );
				},
				render
			);
		}


		if (this.attribs) {
			render = getRenderLink(
				{
					attribs: this.attribs
				},
				function (out, x, cb) {
					var i;
					for (i in this.attribs) {
						out += ' ' + i + '="' + this.attribs[i] + '"';
					}
					this.next.render( out, x, cb );
				},
				render
			);
		}
	}

	if (this.doctype) {
		render = getRenderLink(
			{
				out: doctypes[ this.doctype ] + this.start
			},
			function (out, x, cb) {
				// add doctype to string
				this.next.render( this.out , x, cb );
			},
			render
		);
	} else {
		render = getRenderLink(
			{
				start: this.start
			},
			function (out, x, cb) {
				this.next.render( this.start, x, cb );
			},
			render
		);
	}

	if (this.nuif) {
		render = getRenderLink(
			{ nuif: this.nuif },
			function (out, x, cb) {
				if (x[ this.nuif ]) {
					this.next.render( out, x, cb);
				} else {
					cb( out, cb.i );
				}
			},
			render
		);
	}


	if (this.scope) {
		render = getRenderLink(
			{ scope: this.scope },
			function (out, x, cb) {
				this.next.render( '', x[ this.scope ], cb);
			},
			render
		);
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