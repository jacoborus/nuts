'use strict';

var getRender = require('./render.js'),
	partial = require('./partial.js'),
	templates = {},
	layouts = {};

/* - Generate compiled tags - */
var compileTag;

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
		tmp = partial( templates[nuas].schema, tmp );
	}
	// open and close tag strings
	var preTag = '<' + tmp.name,
		atts = tmp.attribs,
		nuif = tmp.nuif,
		str = {};

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

	str.classAtt = classAtt;
	str.postTag = '</' + tmp.name + '>';
	str.preTag = preTag;

	var render = getRender.direct( tmp, str );
	var renderLoop = getRender.loop( render, tmp );
	var renderLoopScope = getRender.loopScope( render, tmp );


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
					return renderLoopScope(x);
				}
				return '';
			};
		}
		// simple repeat
		return function (x) {
			if (x[nuif]) {
				return renderLoop(x);
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
		return renderLoopScope;
	}
	// simple repeat
	return renderLoop;
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

var compileLayout = function (tmp) {
	var schema = templates[tmp.layout].schema;
	return newCompiledTag( schema );
};


module.exports = {
	compileTag: compileTag,
	compileLayout: compileLayout,
	templates: templates,
	layouts: layouts
};
