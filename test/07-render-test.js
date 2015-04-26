'use strict';

var expect = require('chai').expect,
	Nuts = require('../src/Nuts.js');


describe( 'nuts.render', function () {
	it( 'render simple tag and text nodes', function (done) {
		var nuts = new Nuts();
		var tmpl = '<span nut="sample">hola</span>';
		nuts
		.addNuts( tmpl )
		.compile( function (err) {
			expect( err ).to.not.be.ok;
			nuts.render( 'sample', {}, function (err, html) {
				expect( err ).to.not.be.ok;
				expect( html ).to.equal( '<span>hola</span>' );
				done();
			});
		});
	});


	it( 'render comment nodes', function (done) {
		var nuts = new Nuts();
		var tmpl = '<span nut="tmplComment"><!--this is a comment--></span>';
		nuts
		.addNuts( tmpl )
		.compile( function (err) {
			expect( err ).to.not.be.ok;
			nuts.render( 'tmplComment', {}, function (err, html) {
				expect( err ).to.not.be.ok;
				expect( html ).to.equal(
					'<span><!--this is a comment--></span>'
				);
				done();
			})
		});
	});

	it( 'render CDATA nodes', function (done) {
		var nuts = new Nuts();
		var tmpl = '<span nut="tmplCdata"><![CDATA[ This is a CDATA block ]]></span>';
		nuts
		.addNuts( tmpl )
		.compile( function (err) {
			expect( err ).to.not.be.ok;
			nuts.render( 'tmplCdata', {}, function (err, html) {
				expect( html ).to.equal(
					'<span><![CDATA[ This is a CDATA block ]]></span>'
				);
				done();
			});
		});
	});

	it( 'render through parent scope', function () {
		var nuts = new Nuts(),
			tmpl = '<ul nut="simpleScope"><li>hola</li></ul>';
		nuts
		.addNuts( tmpl )
		.compile( function (err) {
			nuts.render( 'simpleScope', {}, function (err, html) {
				expect( err ).to.not.be.ok;
				expect( html ).to.equal( '<ul><li>hola</li></ul>' );
			});
		});
	});

	it( 'render regular attributes', function () {
		var nuts = new Nuts(),
			tmpl = '<span nut="regularAttribs" id="id" other="other"></span>';
		nuts
		.addNuts( tmpl )
		.compile( function (err) {
			expect( err ).to.not.be.ok;
			nuts.render( 'regularAttribs', {}, function (err, html) {
				expect( html ).to.equal( '<span id="id" other="other"></span>' );
			});
		});
	});

	it( 'render simple className', function () {
		var nuts = new Nuts();
		var tmpl = '<span nut="simpleClass" class="featured"></span>';
		nuts
		.addNuts( tmpl )
		.compile( function (err) {
			expect( err ).to.not.be.ok;
			nuts.render( 'simpleClass', {}, function (err, html) {
				expect( html ).to.equal( '<span class="featured"></span>' );
			});
		});
	});

	it( 'render doctype', function () {
		var nuts = new Nuts();
		var tmpl = '<html nut="doctype" nu-doctype></html>';
		nuts
		.addNuts( tmpl )
		.compile( function (err) {
			expect( err ).to.not.be.ok;
			nuts.render( 'doctype', {}, function (err, html) {
				expect( html ).to.equal( '<!DOCTYPE html><html></html>' );
			});
		});
	});

	it( 'render void elements', function () {
		var nuts = new Nuts();
		var tmpl = '<span nut="voidElements">' +
				'<area>' +
				'<base>' +
				'<br>' +
				'<col>' +
				'<embed>' +
				'<hr>' +
				'<img>' +
				'<input>' +
				'<keygen>' +
				'<link>' +
				'<meta>' +
				'<param>' +
				'<source>' +
				'<track>' +
				'<wbr>' +
			'</span>';
		nuts
		.addNuts( tmpl )
		.compile( function (err) {
			expect( err ).to.not.be.ok;
			nuts.render( 'voidElements', {}, function (err, html) {
				expect( html ).to.equal( '<span>' +
					'<area>' +
					'<base>' +
					'<br>' +
					'<col>' +
					'<embed>' +
					'<hr>' +
					'<img>' +
					'<input>' +
					'<keygen>' +
					'<link>' +
					'<meta>' +
					'<param>' +
					'<source>' +
					'<track>' +
					'<wbr>' +
				'</span>' );
			});
		});
	});

	it( 'render SVG elements', function () {
		var nuts = new Nuts();
		var tmpl = '<span nut="svgElements">' +
				'<path>' +
				'<circle>' +
				'<ellipse>' +
				'<line>' +
				'<rect>' +
				'<use>' +
				'<stop>' +
				'<polyline>' +
				'<polygone>' +
			'</span>';
		nuts
		.addNuts( tmpl )
		.compile( function (err) {
			expect( err ).to.not.be.ok;
			nuts.render( 'svgElements', {}, function (err, html) {
				expect( html ).to.equal( '<span>' +
					'<path>' +
					'<circle>' +
					'<ellipse>' +
					'<line>' +
					'<rect>' +
					'<use>' +
					'<stop>' +
					'<polyline>' +
					'<polygone>' +
				'</span>' );
			});
		});
	});
});
