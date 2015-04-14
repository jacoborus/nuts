'use strict';

var renderNoModel = function (nut, next) {
	if (nut.scope) {
		nut.render = function (x) {
			var out = this.start,
				y = x[ this.scope ];
			if (this.children) {
				this.children.forEach( function (child) {
					out += child.render(y);
				});
			}
			return out + this.end;
		};
	} else {
		nut.render = function (x) {
			var out = this.start;
			if (this.children) {
				this.children.forEach( function (child) {
					out += child.render(x);
				});
			}
			return out + this.end;
		};
	}
	next();
};

var renderModel = function (nut, next) {
	nut.render = function (x) {
		var out = this.start,
			y = this.scope ? x[ this.scope ] : x;

		if (typeof y[this.model] !== 'undefined') {
			out += y[this.model];
		} else if (this.children) {
			this.children.forEach( function (child) {
				out += child.render(y);
			});
		}
		return out + this.end;
	};
	next();
};

module.exports = {
	renderModel: renderModel,
	renderNoModel: renderNoModel
};
