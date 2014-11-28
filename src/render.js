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

var direct = function (t, str) {
	var pipe = t.pipe,
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
		preTag = str.preTag,
		postTag = str.postTag;

	var selfClose = voidElements[t.name];

	return function (x, key) {
		var out = preTag,
			preX = {},
			props = [],
			len, i;

		if (pipe === '') {
			for (i in x) {
				preX[i] = x[i];
			}
		}
		if (pipe) {
			props = pipe.split(' ');
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
		// pipe properties from parent
		if (pipe || pipe === '') {
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

		// pipe properties from parent
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
			// compile content
			if (model && x[model]) {
				out += x[model];
			} else if (model === '') {
				out += x;
			} else if (t.key === '') {
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
		}

		return out;
	};
};



var loop = function (render) {
	return function (x) {
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
};



var loopScope = function (render, tmp) {
	return function (x) {
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
};



module.exports = {
	direct: direct,
	loop: loop,
	loopScope: loopScope
};
