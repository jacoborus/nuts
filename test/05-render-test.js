'use strict';

var expect = require('chai').expect,
	Nuts = require('../src/Nuts.js');


describe( 'nuts.render', function () {
	var nuts = new Nuts();
	it('render simple tag and text nodes', function (done) {
		var tmpl = '<span nut="sample">hola</span>';
		nuts
		.addNuts( tmpl )
		.exec( function (err) {
			expect( err ).to.not.be.ok;
			expect( nuts.render( 'sample', {} )).to.equal( '<span>hola</span>' );
			done();
		});
	});


	it.skip('render comment nodes', function (done) {
		var tmpl = '<span nut="tmplComment"><!--this is a comment--></span>';
		nuts
		.addTemplate( tmpl )
		.exec( function (err) {
			expect( err ).to.equal( undefined );
			expect( nuts.render( 'tmplComment', {} )).to.equal(
				'<span><!--this is a comment--></span>'
			);
			done();
		});
	});

	it.skip('render CDATA nodes', function (done) {
		var tmpl = '<span nut="tmplCdata"><![CDATA[ This is a CDATA block ]]></span>';
		nuts
		.addTemplate( tmpl )
		.exec( function (err) {
			expect( err ).to.equal( undefined );
			expect( nuts.render( 'tmplCdata', {} )).to.equal( '<span><![CDATA[ This is a CDATA block ]]></span>' );
			done();
		});
	});

	it.skip('render through simple scope', function () {
		var tmpl = '<ul nut="simpleScope"><li>hola</li></ul>';
		nuts
		.addTemplate( tmpl )
		.exec( function () {
			expect( nuts.render( 'simpleScope', {} )).to.equal( '<ul><li>hola</li></ul>' );
		});
	});

	it.skip('render regular attributes', function () {
		var tmpl = '<span nut="regularAttribs" id="id" other="other"></span>';
		nuts
		.addTemplate( tmpl )
		.exec( function () {
			expect(
				nuts.render('regularAttribs')
			).to.equal( '<span id="id" other="other"></span>' );
		});
	});

	it.skip('render simple className', function () {
		var tmpl = '<span nut="simpleClass" class="featured"></span>';
		nuts
		.addTemplate( tmpl )
		.exec( function () {
			expect(
				nuts.render('simpleClass')
			).to.equal( '<span class="featured"></span>' );
		});
	});

	it.skip('render doctype', function () {
		var tmpl = '<html nut="doctype" nu-doctype></html>';
		nuts
		.addTemplate( tmpl )
		.exec( function () {
			expect(
				nuts.render('doctype')
			).to.equal( '<!DOCTYPE html><html></html>' );
		});
	});

	it.skip('render void elements', function () {
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
		.addTemplate( tmpl )
		.exec( function () {
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

	it.skip('render SVG elements', function () {
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
		.addTemplate( tmpl )
		.exec( function () {
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

	it.skip('render checked', function (done) {
		var tmpl = '<input nut="checked" type="radio" name="name" value="value" nu-scope="nuscope" nu-checked>';
		nuts
		.addTemplate( tmpl )
		.exec( function () {
			expect(
				nuts.render('checked', {nuscope:true})
			).to.equal( '<input type="radio" name="name" value="value" checked>' );
			done();
		});
	});

	it.skip('render checked scoped', function (done) {
		var tmpl = '<input nut="checkedScope" type="radio" name="name" value="value" nu-checked="nuscope">';
		nuts
		.addTemplate( tmpl )
		.exec( function () {
			expect(
				nuts.render('checkedScope', {nuscope:true})
			).to.equal( '<input type="radio" name="name" value="value" checked>' );
			done();
		});
	});
});
