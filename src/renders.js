'use strict';

var renderNoModel = function (nut, next) {
	if (nut.scope) {
		if (nut.printChildren) {
			nut.render = function (x) {
				var y = x[ this.scope ];
				return this.start + this.printChildren( y ) + this.end;
			};
		} else {
			nut.out = nut.start + nut.end;
			nut.render = function () {
				return this.out;
			};
		}
	} else {
		if (nut.printChildren) {
			nut.render = function (x) {
				return this.start + this.printChildren( x ) + this.end;
			};
		} else {
			nut.out = nut.start + nut.end;
			nut.render = function (x) {
				return this.out;
			};
		}
	}
	next();
};

var renderModel = function (nut, next) {
	if (nut.scope) {
		if (nut.printChildren) {
			nut.render = function (x) {
				var out = this.start,
					y = x[ this.scope ];

				if (typeof y[this.model] !== 'undefined') {
					out += y[this.model];
				} else {
					out += this.printChildren( y );
				}
				return out + this.end;
			};
		} else {
			nut.render = function (x) {
				var out = this.start,
					y = x[ this.scope ];

				if (typeof y[this.model] !== 'undefined') {
					out += y[this.model];
				}
				return out + this.end;
			};
		}
	} else {
		nut.render = function (x) {
			var out = this.start;

			if (typeof x[this.model] !== 'undefined') {
				out += x[this.model];
			} else if (this.children) {
				out += this.printChildren( x );
			}
			return out + this.end;
		};
	}
	next();
};

module.exports = {
	renderModel: renderModel,
	renderNoModel: renderNoModel
};
