'use strict';

var voidElements = {
	area: true,
	base: true,
	br: true,
	col: true,
	embed: true,
	hr: true,
	img: true,
	input: true,
	keygen: true,
	link: true,
	meta: true,
	param: true,
	source: true,
	track: true,
	wbr: true,
	path: true,
	circle: true,
	ellipse: true,
	line: true,
	rect: true,
	use: true,
	stop: true,
	polyline: true,
	polygone: true
};


var printChildren = function (children, x) {
	var i = 0,
		len = children.length,
		out = '';
	while (i < len) {
		out += children[i].render( x );
		i++;
	}
	return out;
};


var direct = function (t, str) {
	var inherit = t.inherit,
		scope = t.scope,
		model = t.model,
		nuSakes = t.nuSakes,
		children = t.children,
		namesakes = t.namesakes,
		className = t.class,
		nuAtts = t.nuAtts,
		nuClass = t.nuClass,
		classAtt = str.classAtt,
		checked = t.checked,
		each = t.each,
		preTag = str.preTag,
		postTag = str.postTag;

	var selfClose = voidElements[t.name];

	return function (x) {
		var out = preTag,
			preX = {},
			props = [],
			len, i, j, z;

		if (inherit === '') {
			for (i in x) {
				preX[i] = x[i];
			}
		}
		if (inherit) {
			props = inherit.split(' ');
			for (i in props) {
				preX[props[i]] = x[props[i]];
			}
		}
		// set scope
		if (scope) {
			if (x[scope]) {
				x = x[scope];
			} else {
				x = {};
			}
		}
		// inherit properties from parent
		if (inherit || inherit === '') {
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

		// print checked attribute
		if (checked === '') {
			if (x) {
				out += ' checked';
			}
		} else if (checked) {
			if (x[checked]) {
				out += ' checked';
			}
		}
		// close open tag
		out += '>';

		if (!selfClose) {
			if (each || each === '') {
				if (each === '') {
					z = x;
				} else if (x[each]) {
					z = x[each];
				}
				if (z) {
					i = 0;
					len = z.length;
					while (i < len) {
						j = z[i];
						out += printChildren( children, j );
						i++;
					}
				}
			} else {
				// compile content
				if (model && x[model]) {
					out += x[model];
				} else if (model === '') {
					out += x;
				} else {
					out += printChildren( children, x );
				}
			}
			// close tag
			out += postTag;
		}

		return out;
	};
};



var loop = function (render) {
	return function (x) {
		var out = '',
			i = 0,
			len = x.length;
		while (i < len) {
			out += render( x[i], i );
			i++;
		}
		return out;
	};
};



var loopScope = function (render, tmp) {
	return function (x) {
		var out = '',
			rep = x[tmp.repeat],
			len = rep.length,
			i = 0;
		while (i < len) {
			out += render( rep[i], i );
			i++;
		}
		return out;
	};
};



module.exports = {
	direct: direct,
	loop: loop,
	loopScope: loopScope
};
