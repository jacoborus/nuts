'use strict';

var compiler = require('./compiler.js');

module.exports = function (schema) {
	var compile;
	switch (schema.type) {
		case 'tag':
			compile = compiler.tag;
			break;
		case 'text':
			compile = compiler.text;
			break;
		case 'comment':
			if (this.schema.data.slice(0, 7) !== '[CDATA[') {
				compile = compiler.comment;
				break;
			}
			compile = compiler.cdata;
			break;

		case 'directive':
			compile = compiler.directive;
			break;
	}
	return compile;
};