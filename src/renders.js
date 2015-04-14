'use strict';

var renderNoModel = function (nut, start, end, next) {
	nut.render = function (x) {
		var out = start,
			y = nut.scope ? x[ nut.scope ] : x;

		if (nut.children) {
			nut.children.forEach( function (child) {
				out += child.render(y);
			});
		}

		return out + end;
	};
	next();
}

var renderModel = function (nut, start, end, next) {
	nut.render = function (x) {
		var out = start,
			y = nut.scope ? x[ nut.scope ] : x;

		if (typeof y[nut.model] !== 'undefined') {
			out += y[nut.model];
		} else if (nut.children) {
			nut.children.forEach( function (child) {
				out += child.render(y);
			});
		}
		return out + end;
	}
	next()
}

module.exports = {
	renderModel: renderModel,
	renderNoModel: renderNoModel
};
