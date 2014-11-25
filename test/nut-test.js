'use strict';

var expect = require('chai').expect,
	nuts = require('../index.js');


describe( 'Template schema', function () {

	it('generate a schema from template string', function (done) {
		var tmpl = '<ul></ul>';
		nuts.addTemplate( 'simpleTag', tmpl, function (err) {
			expect( err ).to.equal( null );
			expect( nuts.getTemplate('simpleTag').schema.type ).to.equal( 'tag' );
			expect( nuts.getTemplate('simpleTag').schema.name ).to.equal( 'ul' );
			done();
		});
	});

	it('separate nuts attributes from regular ones', function (done) {
		var tmpl = '<span id="id" nu-id="nuid">hello</span>';
		nuts.addTemplate( 'separateAtts', tmpl, function (err) {
			expect( err ).to.equal( null );
			expect( nuts.getTemplate('separateAtts').schema.attribs.id ).to.equal( 'id' );
			expect( nuts.getTemplate('separateAtts').schema.nuAtts.id ).to.equal( 'nuid' );
			done();
		});
	});
});
