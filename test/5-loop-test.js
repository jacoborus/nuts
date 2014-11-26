'use strict';

var expect = require('chai').expect,
	nuts = require('../index.js');


describe( 'Loop', function () {

	it('render simple array loops', function () {

		var tmpl = '<ul nu-scope="nums"><li nu-repeat nu-model></li></ul>';
		nuts.addTemplate( 'arrLoop', tmpl, function () {
			expect(
				nuts.render( 'arrLoop', { nums: [1,2,3]})
			).to.equal(
				'<ul><li>1</li><li>2</li><li>3</li></ul>'
			);
		});
	});

	it('render loops through repeat scope array', function () {
		var tmpl = '<ul><li nu-repeat="nums" nu-model></li></ul>';
		nuts.addTemplate( 'arrLoopScoped', tmpl, function () {
			expect(
				nuts.render( 'arrLoopScoped', { nums: [1,2,3]})
			).to.equal(
				'<ul><li>1</li><li>2</li><li>3</li></ul>'
			);
		});
	});
});
