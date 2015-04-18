'use strict';

var expect = require('chai').expect,
	Nuts = require('../src/Nuts.js');


describe( 'Scope', function () {

	it( 'render simple data', function (done) {
		var nuts = new Nuts();
		var tmpl = '<span nut="simpleData" nu-model="word">hi</span>';
		nuts
		.addNuts( tmpl )
		.exec( function (err) {
			expect( err ).to.be.falsy;
			nuts.render( 'simpleData', { word: 'bye' }, function (err, html) {
				expect( html ).to.equal( '<span>bye</span>' );
				done();
			});
		});
	});

	it( 'render data inside inner tags', function (done) {
		var nuts = new Nuts();
		var tmpl = '<ul nut="dataThrough"><li nu-model="word">hi</li></ul>';
		nuts
		.addNuts( tmpl )
		.exec( function (err) {
			expect( err ).to.be.falsy;
			nuts.render( 'dataThrough', { word:'bye' }, function (err, html) {
				expect( html ).to.equal( '<ul><li>bye</li></ul>' );
				done();
			});
		});
	});

	it( 'render data passed through scope', function (done) {
		var nuts = new Nuts();
		var tmpl = '<ul nut="basicScope" nu-scope="card"><li nu-model="name">no name</li></ul>';
		nuts
		.addNuts( tmpl )
		.exec( function (err) {
			expect( err ).to.be.falsy;
			nuts.render( 'basicScope', { card: { name: 'Name' }}, function (err, html) {
				expect( html ).to.equal( '<ul><li>Name</li></ul>' );
				done();
			});
		});
	});

	it( 'use children dom elem if there is no model in data', function (done) {
		var nuts = new Nuts();
		var tmpl = '<ul nut="basicScope" nu-scope="card"><li nu-model="name">no name</li></ul>';
		nuts
		.addNuts( tmpl )
		.exec( function (err) {
			nuts.render( 'basicScope', { card: { }}, function (err, html) {
				expect( html ).to.equal( '<ul><li>no name</li></ul>' );
				done();
			});
		});
	});

	it( 'render data passed through multiple scopes', function (done) {
		var nuts = new Nuts();
		var tmpl = '<div  nut="doubleScope">' +
			'<ul nu-scope="card">'+
			'<li nu-model="name">no name</li>'+
			'</ul></div>';
		nuts
		.addNuts( tmpl )
		.exec( function (err) {
			expect( err ).to.be.falsy;
			nuts.render( 'doubleScope', { card: { name: 'Name' }}, function (err, html) {
				expect( html ).to.equal( '<div><ul><li>Name</li></ul></div>' );
				done();
			});
		});
	});

	it( 'render attributes from data', function (done) {
		var nuts = new Nuts();
		var tmpl = '<span nut="nuAtts" nu-id="color"></span>';
		nuts
		.addNuts( tmpl )
		.exec( function () {
			nuts.render( 'nuAtts', { color: 'white' }, function (err, html) {
				expect( html ).to.equal( '<span id="white"></span>' );
				done();
			});
		});
	});


	it.skip( 'render attributes with namesake', function (done) {
		var nuts = new Nuts();
		var tmpl = '<span nut="nuSakes" id="id" nu-id="nuid"></span>';
		nuts
		.addNuts( tmpl )
		.exec( function () {
			nuts.render( 'nuSakes', {nuid: 'white'}, function (err, html) {
				expect( html ).to.equal( '<span id="white"></span>' );
				nuts.render( 'nuSakes', {}, function (err, html) {
					expect( html ).to.equal( '<span id="id"></span>' );
					done();
				});
			});
		});
	});


	it.skip( 'render className from data', function () {
		var nuts = new Nuts();
		var tmpl = '<span nut="classData" class="featured" nu-class="nuclass">bye</span>';
		nuts
		.addNuts( tmpl )
		.exec( function (err) {
			expect( err ).to.be.falsy;
			nuts.render( 'classData', { nuclass: 'white' }, function (err, html) {
				expect( html ).to.equal( '<span class="featured white">bye</span>' );
			});
		});
	});


	it.skip( 'Inserts the element only when the value evaluates to true', function (done) {
		var nuts = new Nuts();
		var tmpl = '<span nut="nuif" nu-if="color">hi</span>';
		nuts
		.addNuts( tmpl )
		.exec( function () {
			nuts.render( 'nuif', {color: true}, function (err, html) {
				expect( html ).to.equal( '<span>hi</span>' );
				nuts.render( 'nuif', {}, function (err, html) {
					expect( html ).to.equal( '' );
					done();
				});
			});
		});
	});

	it.skip( 'Inserts the loop only when the value evaluates to true', function (done) {
		var nuts = new Nuts();
		var tmpl = '<span nut="ifloop" nu-if="color" nu-repeat="colors">hi</span>';
		nuts
		.addNuts( tmpl )
		.exec( function () {
			nuts.render( 'ifloop', {color: true, colors:[1,2]}, function (err, html) {
				expect( html ).to.equal( '<span>hi</span><span>hi</span>' );
				nuts.render( 'ifloop', {}, function (err, html) {
					expect( html ).to.equal( '' );
				});
			});
		});
	});

});
