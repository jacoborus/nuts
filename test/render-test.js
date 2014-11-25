'use strict';

var expect = require('chai').expect,
	nuts = require('../index.js');


describe( 'nuts.render', function () {

	it('render text nodes', function (done) {
		var tmpl = 'hola';
		nuts.addTemplate( 'tmplText', tmpl, function (err) {
			expect( err ).to.equal( null );
			expect( nuts.render( 'tmplText', {} )).to.equal( 'hola' );
			done();
		});
	});

	it('render comment nodes', function (done) {
		var tmpl = '<!--this is a comment-->';
		nuts.addTemplate( 'tmplComment', tmpl, function (err) {
			expect( err ).to.equal( null );
			expect( nuts.render( 'tmplComment', {} )).to.equal( '<!--this is a comment-->' );
			done();
		});
	});

	it('render directive nodes', function (done) {
		var tmpl = '<!DOCTYPE html>';
		nuts.addTemplate( 'tmplDirective', tmpl, function (err) {
			expect( err ).to.equal( null );
			expect( nuts.render( 'tmplDirective', {} )).to.equal( '<!DOCTYPE html>' );
			done();
		});
	});

	it('render simple tag nodes', function (done) {
		var tmpl = '<span>hola</span>';
		nuts.addTemplate( 'simpleTag', tmpl, function (err) {
			expect( err ).to.equal( null );
			expect( nuts.render( 'simpleTag', {} )).to.equal( '<span>hola</span>' );
			done();
		});
	});

	it('render through simple scope', function () {
		var tmpl = '<ul><li>hola</li></ul>';
		nuts.addTemplate( 'simpleScope', tmpl, function () {
			expect( nuts.render( 'simpleScope', {} )).to.equal( '<ul><li>hola</li></ul>' );
		});
	});

	it('render regular attributes', function () {
		var tmpl = '<span id="id" other="other"></span>';
		nuts.addTemplate( 'regularAttribs', tmpl, function () {
			expect(
				nuts.render('regularAttribs')
			).to.equal( '<span id="id" other="other"></span>' );
		});
	});

	it('render simple className', function () {
		var tmpl = '<span class="featured"></span>';
		nuts.addTemplate( 'simpleClass', tmpl, function () {
			expect(
				nuts.render('simpleClass')
			).to.equal( '<span class="featured"></span>' );
		});
	});
});
