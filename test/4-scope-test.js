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

	it('use children dom elem if there is no model in data', function () {
		expect(
			nuts.render( 'basicScope', { card: { }})
		).to.equal( '<ul><li>no name</li></ul>' );
	});

	it('render data passed through multiple scopes', function () {
		var tmpl = '<div><ul nu-scope="card"><li nu-model="name">no name</li></ul></div>';
		nuts.addTemplate( 'doubleScope', tmpl, function () {
			expect(
				nuts.render( 'doubleScope', { card: { name: 'Name' }})
			).to.equal( '<div><ul><li>Name</li></ul></div>' );
		});
	});

	it('render className from data', function () {
		var tmpl = '<span class="featured" nu-class="nuclass">bye</span>';
		nuts.addTemplate( 'classData', tmpl, function () {
			expect(
				nuts.render('classData', {nuclass: 'white'})
			).to.equal( '<span class="featured white">bye</span>' );
		});
	});

	it('render attributes with namesake', function () {
		var tmpl = '<span id="id" nu-id="nuid"></span>';
		nuts.addTemplate( 'nuSakes', tmpl, function () {
			expect(
				nuts.render('nuSakes', {nuclass: 'white'})
			).to.equal( '<span id="nuid"></span>' );
		});
	});

	it('render attributes from data', function () {
		var tmpl = '<span nu-id="color"></span>';
		nuts.addTemplate( 'nuAtts', tmpl, function () {
			expect(
				nuts.render('nuAtts', {color: 'white'})
			).to.equal( '<span id="white"></span>' );
		});
	});

});
