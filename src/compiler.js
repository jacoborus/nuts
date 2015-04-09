'use strict';

var getRender = require('./render.js'),
	partial = require('./partial.js'),
	templates = {},
	layouts = {},
	filters = {};

/* - Generate compiled tags - */
var compileTag;


var filter = function (x, tmp) {
	if (!tmp.filters) {
		return x;
	}
	var f = tmp.filters,
		y = {},
		i;

	if (f._global) {
		x = f._global(x);
	}

	for (i in x) {
		if (!f[i]) {
			y[i] = x[i];
		} else {
			y[i] = f[i]( x[i], x );
		}
	}
	return y;
};

var newCompiledText = function (tmp) {
	// FIX THIS!!
	var out = tmp.data === ' ' ? '' : tmp.data;
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

var newCompiledCdata = function (tmp) {
	var out = '<!' + tmp.data + '>';
	return function () {
		return out;
	};
};


var newCompiledDirective = function (tmp) {
	var out = '<' + tmp.data + '>';
	return function () {
		return out;
	};
};


var newCompiledTag = function (tmp) {
	var nuas;
	if (tmp.as) {
		nuas = tmp.as;
		delete tmp.as;
		tmp = partial( tmp, templates[nuas].schema );
	}
	// open and close tag strings
	var preTag = '<' + tmp.name,
		atts = tmp.attribs,
		nuif = tmp.nuif;

	var i, className, classAtt;

	// preprint doctype
	if (tmp.doctype) {
		preTag = '<!DOCTYPE html>' + preTag;
	}
	// render regular attributes
	for (i in atts) {
		preTag += ' ' + i + '="' + atts[i] + '"';
	}

	// prepare className tag
	if (tmp.class || tmp.nuClass) {
		classAtt = ' class="';
	}
	if (tmp.class) {
		className = tmp.class;
		classAtt += className;
		if (!tmp.nuClass) {
			classAtt += '"';
			preTag += classAtt;
		}
	}

	var	children = tmp.children;
	for (i in children) {
		children[i].render = compileTag( children[i] );
	}
	var str = {
		classAtt: classAtt,
		postTag: '</' + tmp.name + '>',
		preTag: preTag
	};

	var render = getRender.direct( tmp, str );
	var renderLoop = getRender.loop( render, tmp );
	var renderLoopScope = getRender.loopScope( render, tmp );


	/* - return compiled function - */

	// with nuIf or nuUnless
	if (nuif) {
		// with no loop
		if (!tmp.repeat && tmp.repeat !== '') {
			return function (x) {
				var y = filter( x, tmp );
				if (y[nuif]) {
					return render(y);
				}
				return '';
			};
		}
		// scoped repeat loop
		if (tmp.repeat) {
			return function (x) {
				var y = filter( x, tmp );
				if (y[nuif]) {
					return renderLoopScope(y);
				}
				return '';
			};
		}
		// simple repeat
		return function (x) {
			var y = filter( x, tmp );
			if (y[nuif]) {
				return renderLoop(y);
			}
			return '';
		};
	}

	// Without nuIf or nuUnless
	// with no loop
	if (!tmp.repeat && tmp.repeat !== '') {
		return function (x) {
			var y = filter( x, tmp );
			return render(y);
		};
	}
	// scoped repeat loop
	if (tmp.repeat) {
		return function (x) {
			var y = filter( x, tmp );
			return renderLoopScope(y);
		};
	}
	// simple repeat
	return function (x) {
		var y = filter( x, tmp );
		return renderLoop(y);
	};
};

/*!
 * get a compiled template
 * @param  {Object} template template model
 * @return {Function}          compiled template
 */
compileTag = function (template) {
	var schema = template.schema;
	switch (schema.type) {
		case 'tag':
			return newCompiledTag( schema );
		case 'text':
			return newCompiledText( schema );
		case 'comment':
			if (schema.data.slice(0, 7) !== '[CDATA[') {
				return newCompiledComment( schema );
			}
			return newCompiledCdata( schema );

		case 'directive':
			return newCompiledDirective( schema );
	}
};


var setBlocks = function (schema, blocks) {
	var sch;
	if (schema.block && blocks[schema.block]) {
		sch = templates[blocks[schema.block].extend].schema;
	} else {
		sch = schema;
	}
	var i;
	var children = sch.children;
	for (i in children) {
		children[i].schema = setBlocks( children[i].schema, blocks );
	}
	return sch;
};

var compileLayout = function (tmp) {
	var schema = templates[tmp.layout].schema;
	var blocks = tmp.schema.blocks;
	var extended = setBlocks( schema, blocks );
	return newCompiledTag( extended );
};


module.exports = {
	compileTag: compileTag,
	compileLayout: compileLayout,
	templates: templates,
	layouts: layouts,
	filters: filters
};
