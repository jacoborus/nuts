'use strict';

var expect = require('chai').expect,
	Nuts = require('../src/Nuts.js');


describe( 'nuts.render', function () {
	it('render simple tag and text nodes', function (done) {
		var nuts = new Nuts();
		var tmpl = '<span nut="sample">hola</span>';
		nuts
		.addNuts( tmpl )
		.exec( function (err) {
			expect( err ).to.be.falsy;
			expect( nuts.render( 'sample', {} )).to.equal( '<span>hola</span>' );
			done();
		});
	});


	it('render comment nodes', function (done) {
		var nuts = new Nuts();
		var tmpl = '<span nut="tmplComment"><!--this is a comment--></span>';
		nuts
		.addNuts( tmpl )
		.exec( function (err) {
			expect( err ).to.be.falsy;
			expect( nuts.render( 'tmplComment', {} )).to.equal(
				'<span><!--this is a comment--></span>'
			);
			done();
		});
	});

	it('render CDATA nodes', function (done) {
		var nuts = new Nuts();
		var tmpl = '<span nut="tmplCdata"><![CDATA[ This is a CDATA block ]]></span>';
		nuts
		.addNuts( tmpl )
		.exec( function (err) {
			expect( err ).to.be.falsy;
			expect( nuts.render( 'tmplCdata', {} )).to.equal(
				'<span><![CDATA[ This is a CDATA block ]]></span>'
			);
			done();
		});
	});

	it('render through parent scope', function () {
		var nuts = new Nuts(),
			tmpl = '<ul nut="simpleScope"><li>hola</li></ul>';
		nuts
		.addNuts( tmpl )
		.exec( function (err) {
			expect( err ).to.be.falsy;
			expect( nuts.render( 'simpleScope', {} )).to.equal( '<ul><li>hola</li></ul>' );
		});
	});

	it('render regular attributes', function () {
		var nuts = new Nuts(),
			tmpl = '<span nut="regularAttribs" id="id" other="other"></span>';
		nuts
		.addNuts( tmpl )
		.exec( function (err) {
			expect( err ).to.be.falsy;
			expect(
				nuts.render('regularAttribs')
			).to.equal( '<span id="id" other="other"></span>' );
		});
	});

	it('render simple className', function () {
		var nuts = new Nuts();
		var tmpl = '<span nut="simpleClass" class="featured"></span>';
		nuts
		.addNuts( tmpl )
		.exec( function (err) {
			expect( err ).to.be.falsy;
			expect(
				nuts.render('simpleClass')
			).to.equal( '<span class="featured"></span>' );
		});
	});

	it('render doctype', function () {
		var nuts = new Nuts();
		var tmpl = '<html nut="doctype" nu-doctype></html>';
		nuts
		.addNuts( tmpl )
		.exec( function (err) {
			expect( err ).to.be.falsy;
			expect(
				nuts.render('doctype')
			).to.equal( '<!DOCTYPE html><html></html>' );
		});
	});

	it('render void elements', function () {
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
		.exec( function (err) {
			expect( err ).to.be.falsy;
			expect(
				nuts.render('voidElements')
			).to.equal( '<span>' +
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

	it('render SVG elements', function () {
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
		.exec( function (err) {
			expect( err ).to.be.falsy;
			expect(
				nuts.render('svgElements')
			).to.equal( '<span>' +
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
