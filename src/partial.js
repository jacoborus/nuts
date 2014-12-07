'use strict';

var nuProps = [
	'type',
	'name',
	'class',
	'nuClass',
	'scope',
	'model',
	'repeat',
	'pipe',
	'if',
	'unless',
	'checked',
	'doctype',
	'children',
	'namesakes',
	'nuSakes'
];

var nuObjs = [
	'attribs',
	'nuAtts',
	'namesakes',
	'nuSakes'
];


var partial = function (target, obj) {

	var i, j;

	for (i in nuProps) {
		if (obj[nuProps[i]] || obj[nuProps[i]] === '') {
			target[nuProps[i]] = obj[nuProps[i]];
		}
	}
	if (obj.children.length > 0) {
		if (obj.children.length !== 1 || obj.children[0].schema.data !== ' ') {
			target.children = obj.children;
		}
	}
	for (i in nuObjs) {
		for (j in obj[nuObjs[i]]) {
			target[nuObjs[i]][j] = obj[nuObjs[i]][j];
		}
	}
	return target;
};

module.exports = partial;
