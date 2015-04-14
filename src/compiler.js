'use strict';



var text = function () {
	var out = this.schema.data;
	return function () {
		return out;
	};
};


var comment = function () {
	var out = '<!--' + this.data + '-->';
	return function () {
		return out;
	};
};

var cdata = function () {
	var out = '<!' + this.data + '>';
	return function () {
		return out;
	};
};

var directive = function () {
	var out = '<' + this.data + '>';
	return function () {
		return out;
	};
};

var tag = function () {
	var self = this;
	var start = '<' + this.schema.name + '>';

	if (this.children) {
		this.children.forEach( function (child) {
			child.render = child.compile( child );
		});
	}

	var end = '</' + this.schema.name + '>';
	return function () {
		var out = start;
		if (self.children) {
			self.children.forEach( function (child) {
				out += child.render();
			});
		}
		return out + end;
	};
};

module.exports = {
	text: text,
	comment: comment,
	cdata: cdata,
	directive: directive,
	tag: tag

};