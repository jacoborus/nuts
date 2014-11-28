'use strict';

var nuProps = [
	'type',
	'name',
	'class',
	'nuClass',
	'scope',
	'model',
	'repeat',
	'key',
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

var isEmpty = function (obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop)) {
            return false;
        }
    }
    return true;
};

var extendTag = function (target, obj) {

	var i, j;

	for (i in nuProps) {
		if (obj[i] || obj[i] === '') {
			target[i] = obj[i];
		}
	}
	if (!isEmpty( obj.children )) {
		target.children = obj.children;
	}
	for (i in nuObjs) {
		for (j in obj[nuObjs[i]]) {
			target[nuObjs[i]][j] = obj[nuObjs[i]][j];
		}
	}
	return target;
};

module.exports = extendTag;
