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

	it('render data inside inner tags', function () {
		var tmpl = '<ul><li nu-model="word">hi</li></ul>';
		nuts.addTemplate( 'dataThrough', tmpl, function () {
			expect(
				nuts.render( 'dataThrough', { word:'bye' })
			).to.equal( '<ul><li>bye</li></ul>' );
		});
	});

	it('render data passed through scope', function () {
		var tmpl = '<ul nu-scope="card"><li nu-model="name">no name</li></ul>';
		nuts.addTemplate( 'basicScope', tmpl, function () {
			expect(
				nuts.render( 'basicScope', { card: { name: 'Name' }})
			).to.equal( '<ul><li>Name</li></ul>' );
		});
	});
});
