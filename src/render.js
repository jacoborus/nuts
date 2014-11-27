'use strict';

module.exports = function (tmp, preTag, nuClass, namesakes, nuAtts, children, postTag, nuSakes, classAtt, className) {
	return function (x, key) {
		var out = preTag;
		var len;
		var preX = {},
			props = [],
			i;
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
};