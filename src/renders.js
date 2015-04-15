'use strict';

var renders = {
	scope: {
		model: {
			children: function (x) {
				var out = this.start,
					y = x[ this.scope ];

				if (typeof y[this.model] !== 'undefined') {
					out += y[this.model];
				} else {
					out += this.printChildren( y );
				}
				return out + this.end;
			},
			noChildren: function (x) {
				var out = this.start,
					y = x[ this.scope ];

				if (typeof y[this.model] !== 'undefined') {
					out += y[this.model];
				}
				return out + this.end;
			}
		},
		noModel: {
			children: function (x) {
				return this.start + this.printChildren( x[ this.scope ] ) + this.end;
			},
			noChildren: function () {
				return this.start + this.end;
			}
		}
	},
	noScope: {
		model: {
			children: function (x) {
				var out = this.start,
					model = x[this.model];

				if (typeof model !== 'undefined') {
					out += model;
				} else if (this.children) {
					out += this.printChildren( x );
				}
				return out + this.end;
			},
			noChildren: function (x) {
				var out = this.start,
					model = x[this.model];
				if (typeof model !== 'undefined') {
					out += model;
				}
				return out + this.end;
			}
		},
		noModel: {
			children: function (x) {
				return this.start + this.printChildren( x ) + this.end;
			},
			noChildren: function () {
				return this.start + this.end;
			}
		}
	}
};

var renderNoModel = function (nut, next) {
	if (nut.scope) {
		if (nut.printChildren) {
			nut.render = renders.scope.noModel.children;
		} else {
			nut.render = renders.scope.noModel.noChildren;
		}
	} else {
		if (nut.printChildren) {
			nut.render = renders.noScope.noModel.children;
		} else {
			nut.render = renders.noScope.noModel.noChildren;
		}
	}
	next();
};

var renderModel = function (nut, next) {
	if (nut.scope) {
		if (nut.printChildren) {
			nut.render = renders.scope.model.children;
		} else {
			nut.render = renders.scope.model.noChildren;
		}
	} else {
		if (nut.printChildren) {
			nut.render = renders.noScope.model.children;
		} else {
			nut.render = renders.noScope.model.noChildren;
		}
	}
	next();
};


module.exports = {
	renderModel: renderModel,
	renderNoModel: renderNoModel
};
