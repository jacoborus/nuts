'use strict';

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
		preTag = str.preTag,
		postTag = str.postTag;


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

		// close open tag
		out += '>';

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