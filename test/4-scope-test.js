'use strict';

var expect = require('chai').expect,
	nuts = require('../index.js');


describe( 'Scope', function () {

	it('render simple data', function () {
		var tmpl = '<span nu-model="word">hi</span>';
		nuts.addTemplate( 'simpleData', tmpl, function () {
			expect(
				nuts.render( 'simpleData', { word: 'bye' })
			).to.equal( '<span>bye</span>' );
		});
	});
});
