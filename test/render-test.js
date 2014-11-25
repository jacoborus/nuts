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
		nuts.addTemplate( 'tmplComment', tmpl, function (err, tmpls) {
			expect( err ).to.equal( null );
			expect( nuts.render( 'tmplComment', {} )).to.equal( '<!--this is a comment-->' );
			done();
		});
	});

	it('render directive nodes', function (done) {
		var tmpl = '<!DOCTYPE html>';
		nuts.addTemplate( 'tmplDirective', tmpl, function (err, tmpls) {
			expect( err ).to.equal( null );
			expect( nuts.render( 'tmplDirective', {} )).to.equal( '<!DOCTYPE html>' );
			done();
		});
	});
});
