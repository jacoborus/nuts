'use strict';

var expect = require('chai').expect,
	nuts = require('../index.js');


describe( 'Render', function () {

	it('render simple text nodes', function (done) {
		var tmpl = 'hola';
		nuts.addTemplate( 'tmplText', tmpl, function (err) {
			expect( err ).to.equal( null );
			expect( nuts.render( 'tmplText', {} )).to.equal( 'hola' );
			done();
		});
	});
});
