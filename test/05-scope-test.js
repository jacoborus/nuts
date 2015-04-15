'use strict';

var expect = require('chai').expect,
	nuts = require('../index.js');


describe( 'Scope', function () {

	it( 'render simple data', function () {
		var tmpl = '<span nut="simpleData" nu-model="word">hi</span>';
		nuts
		.addNuts( tmpl )
		.exec( function (err) {
			expect( err ).to.be.falsy;
			expect(
				nuts.render( 'simpleData', { word: 'bye' })
			).to.equal( '<span>bye</span>' );
		});
	});

	it( 'render data inside inner tags', function () {
		var tmpl = '<ul nut="dataThrough"><li nu-model="word">hi</li></ul>';
		nuts
		.addNuts( tmpl )
		.exec( function (err) {
			expect( err ).to.be.falsy;
			expect(
				nuts.render( 'dataThrough', { word:'bye' })
			).to.equal( '<ul><li>bye</li></ul>' );
		});
	});

	it( 'render data passed through scope', function (done) {
		var tmpl = '<ul nut="basicScope" nu-scope="card"><li nu-model="name">no name</li></ul>';
		nuts
		.addNuts( tmpl )
		.exec( function (err) {
			expect( err ).to.be.falsy;
			expect(
				nuts.render( 'basicScope', { card: { name: 'Name' }})
			).to.equal( '<ul><li>Name</li></ul>' );
			done();
		});
	});

	it( 'use children dom elem if there is no model in data', function () {
		expect(
			nuts.render( 'basicScope', { card: { }})
		).to.equal( '<ul><li>no name</li></ul>' );
	});

	it( 'render data passed through multiple scopes', function (done) {
		var tmpl = '<div  nut="doubleScope">' +
			'<ul nu-scope="card">'+
			'<li nu-model="name">no name</li>'+
			'</ul></div>';
		nuts
		.addNuts( tmpl )
		.exec( function (err) {
			expect( err ).to.be.falsy;
			expect(
				nuts.render( 'doubleScope', { card: { name: 'Name' }})
			).to.equal( '<div><ul><li>Name</li></ul></div>' );
			done();
		});
	});

	it.skip( 'render attributes from data', function () {
		var tmpl = '<span nut="nuAtts" nu-id="color"></span>';
		nuts
		.addNuts( tmpl )
		.exec( function () {
			expect(
				nuts.render('nuAtts', {color: 'white'})
			).to.equal( '<span id="white"></span>' );
		});
	});

	it.skip( 'render className from data', function () {
		var tmpl = '<span nut="classData" class="featured" nu-class="nuclass">bye</span>';
		nuts
		.addNuts( tmpl )
		.exec( function (err) {
			expect( err ).to.be.falsy;
			expect(
				nuts.render('classData', {nuclass: 'white'})
			).to.equal( '<span class="featured white">bye</span>' );
		});
	});

	it.skip( 'render attributes with namesake', function () {
		var tmpl = '<span nut="nuSakes" id="id" nu-id="nuid"></span>';
		nuts
		.addNuts( tmpl )
		.exec( function () {
			expect(
				nuts.render('nuSakes', {nuclass: 'white'})
			).to.equal( '<span id="nuid"></span>' );
		});
	});


	it.skip( 'Inserts the element only when the value evaluates to true', function () {
		var tmpl = '<span nut="nuif" nu-if="color">hi</span>';
		nuts
		.addNuts( tmpl )
		.exec( function () {
			expect(
				nuts.render('nuif', {color: true})
			).to.equal( '<span>hi</span>' );
			expect(
				nuts.render('nuif')
			).to.equal( '' );
		});
	});

	it.skip( 'Inserts the loop only when the value evaluates to true', function () {
		var tmpl = '<span nut="ifloop" nu-if="color" nu-repeat="colors">hi</span>';
		nuts
		.addNuts( tmpl )
		.exec( function () {
			expect(
				nuts.render('ifloop', {color: true, colors:[1,2]})
			).to.equal( '<span>hi</span><span>hi</span>' );
			expect(
				nuts.render('ifloop')
			).to.equal( '' );
		});
	});

});
