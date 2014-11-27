'use strict';

/* - Generate compiled tags - */
var compile;

var newCompiledText = function (tmp) {
	var out = tmp.data;
	return function () {
		return out;
	};
};

var newCompiledComment = function (tmp) {
	var out = '<!--' + tmp.data + '-->';
	return function () {
		return out;
	};
};

var newCompiledDirective = function (tmp) {
	var out;
	if (tmp.name === '!doctype') {
		out = '<!DOCTYPE html>';
	} else {
		out = '<' + tmp.name + '>';
	}
	return function () {
		return out;
	};
};

var newCompiledTag = function (tmp) {
	var i, className, nuClass, classAtt;

	// open and close tag strings
	var preTag = '<' + tmp.name,
		postTag = '</' + tmp.name +'>',
		namesakes = tmp.namesakes,
		nuSakes = tmp.nuSakes,
		nuAtts = tmp.nuAtts,
		atts = tmp.attribs,
		nuif = tmp.nuif;

	// render regular attributes
	for (i in atts) {
		preTag += ' ' + i + '="' + atts[i] + '"';
	}

	// prepare className tag
	nuClass = tmp.nuClass;
	if (tmp.class || nuClass) {
		classAtt = ' class="';
	}
	if (tmp.class) {
		className = tmp.class;
		classAtt += className;
		if (!nuClass) {
			classAtt += '"';
			preTag += classAtt;
		}
	}

	var	children = tmp.children;
	for (i in children) {
		children[i].render = compile( children[i] );
	}

	var render = function (x, key) {
		var out = preTag;
		var len;
		var preX = {},
			props = [];
		if (tmp.pipe === '') {
			for (i in x) {
				preX[i] = x[i];
			}
		}
		if (tmp.pipe) {
			props = tmp.pipe.split(' ');
			for (i in props) {
				preX[props[i]] = x[props[i]];
			}
		}
		// set scope
		if (tmp.scope) {
			if (x[tmp.scope]) {
				x = x[tmp.scope];
			} else {
				x = {};
			}
		}
		// pipe properties from parent
		if (tmp.pipe || tmp.pipe === '') {
			for (i in preX) {
				x[i] = preX[i];
			}
		}
		// render nuClass
		if (nuClass) {
			out += classAtt;
			if (nuClass && x[nuClass]) {
				out += className ? ' ' + x[nuClass] : x[nuClass];
			}
			out += '"';
		}
		// render namesakes
		for (i in namesakes) {
			out += ' ' + i + '="' + (nuSakes[i] || namesakes[i]) + '"';
		}
		// render nuAttributes
		for (i in nuAtts) {
			out += ' ' + i + '="' + (x[nuAtts[i]] || '') + '"';
		}

		// close open tag
		out += '>';

		// compile content
		if (tmp.model && x[tmp.model]) {
			out += x[tmp.model];
		} else if (tmp.model === '') {
			out += x;
		} else if (tmp.key === '') {
			out += key;
		} else {
			i = 0;
			len = children.length;
			while (i < len) {
				out += children[i].render( x, key );
				i++;
			}
		}

		// close tag
		out += postTag;
		return out;
	};

	var renderRepeat = function (x) {
		var out = '',
			i = 0,
			len = x.length;
		if (len) {
			while (i < len) {
				out += render( x[i], i );
				i++;
			}
		} else if ('object' === typeof x) {
			for (i in x) {
				out += render( x[i], i );
			}
		}
		return out;
	};

	var renderRepeatLoop = function (x) {
		var out = '',
			rep = x[tmp.repeat],
			len = rep.length,
			i = 0;
		if (len) {
			while (i < len) {
				out += render( rep[i], i );
				i++;
			}
		} else if ('object' === typeof rep) {
			for (i in rep) {
				out += render( rep[i], i );
			}
		}
		return out;
	};

	/* - return compiled function - */

	// with nuIf or nuUnless
	if (nuif) {
		// with no loop
		if (!tmp.repeat && tmp.repeat !== '') {
			return function (x) {
				if (x[nuif]) {
					return render(x);
				}
				return '';
			};
		}
		// scoped repeat loop
		if (tmp.repeat) {
			return function (x) {
				if (x[nuif]) {
					return renderRepeatLoop(x);
				}
				return '';
			};
		}
		// simple repeat
		return function (x) {
			if (x[nuif]) {
				return renderRepeat(x);
			}
			return '';
		};
	}

	// Without nuIf or nuUnless
	// with no loop
	if (!tmp.repeat && tmp.repeat !== '') {
		return render;
	}
	// scoped repeat loop
	if (tmp.repeat) {
		return renderRepeatLoop;
	}
	// simple repeat
	return renderRepeat;
};


/*!
 * get a compiled template
 * @param  {Object} template template model
 * @return {Function}          compiled template
 */
compile = function (template) {
	var schema = template.schema;
	switch (schema.type) {
		case 'tag':
			return newCompiledTag( schema );
		case 'text':
			return newCompiledText( schema );
		case 'comment':
			return newCompiledComment( schema );
		case 'directive':
			return newCompiledDirective( schema );
	}
};

module.exports = compile;
