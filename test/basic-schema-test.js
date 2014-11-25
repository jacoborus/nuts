'use strict';

var expect = require('chai').expect,
	nuts = require('../index.js');


describe( 'Template schema', function () {

	it('generate a schema form template string', function (done) {
		var tmpl = '<span>hola</span>';
		nuts.addTemplate( 'uno', tmpl, function (err) {
			expect( err ).to.equal( null );
			expect( nuts.getTemplate('uno').schema.name ).to.equal( 'span' );
			done();
		});
	});
});
