'use strict';

var expect = require('chai').expect,
	nuts = require('../index.js');

describe.skip( 'Formatters', function () {
	it('give simple format to nu-model', function (done) {
		var tmpl = '<span nu-model="number | euro" nut="simpleFormatter"></span>';
		nuts
		.addTemplate( tmpl )
		.addFormatter( 'euro', function (val) {
			return val + '€';
		})
		.exec( function () {
			var rendered = nuts.render( 'simpleFormatter', { number: 50 });
			expect( rendered ).to.equal( '<span>50€</span>' );
			done();
		});
	});
});
