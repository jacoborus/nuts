'use strict';

var expect = require('chai').expect,
	nuts = require('../index.js');


describe( 'Partial', function () {
	it('render simple partials', function (done) {
		var tmpl = '<ul nut="simplePartialUl"><li nu-as="simplePartialLi"></li></ul>' +
			'<li nut="simplePartialLi" yeah="yeah">nuts</li>';
		nuts.addTemplate( tmpl, function () {
			expect(
				nuts.render('simplePartialUl')
			).to.equal( '<ul><li yeah="yeah">nuts</li></ul>' );
			done();
		});
	});
});
