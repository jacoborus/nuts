'use strict';

var nuProps = [
	'type',
	'name',
	'class',
	'nuClass',
	'scope',
	'model',
	'repeat',
	'inherit',
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

	var i;

	nuProps.forEach( function (prop) {
		if (obj[prop] || obj[prop] === '') {
			target[prop] = obj[prop];
		}
	});

	if (obj.children.length > 0) {
		if (obj.children.length !== 1 || obj.children[0].schema.data !== ' ') {
			target.children = obj.children;
		}
	}
	nuObjs.forEach( function (o) {
		for (i in obj[o]) {
			target[o][i] = obj[o][i];
		}
	});

	return target;
};

module.exports = partial;
