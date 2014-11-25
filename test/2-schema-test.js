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

	it('distribute special nuts attributes', function (done) {
		var tmpl = '<span ' +
			'class="class" ' +
			'nu-class="nuclass"' +
			'nu-scope="scope"' +
			'nu-extend="extend"' +
			'nu-model="model"' +
			'nu-key ' +
			'nu-repeat="repeat"' +
			'>' +
			'hello' +
			'</span>';
		nuts.addTemplate( 'specialNuTs', tmpl, function (err) {
			expect( err ).to.equal( null );
			expect( nuts.getTemplate('specialNuTs').schema.class ).to.equal( 'class' );
			expect( nuts.getTemplate('specialNuTs').schema.nuClass ).to.equal( 'nuclass' );
			expect( nuts.getTemplate('specialNuTs').schema.nuAtts.class ).to.not.exist;
			expect( nuts.getTemplate('specialNuTs').schema.scope ).to.equal( 'scope' );
			expect( nuts.getTemplate('specialNuTs').schema.nuAtts.scope ).to.not.exist;
			expect( nuts.getTemplate('specialNuTs').schema.model ).to.equal( 'model' );
			expect( nuts.getTemplate('specialNuTs').schema.nuAtts.model ).to.not.exist;
			expect( nuts.getTemplate('specialNuTs').schema.repeat ).to.equal( 'repeat' );
			expect( nuts.getTemplate('specialNuTs').schema.nuAtts.repeat ).to.not.exist;
			expect( nuts.getTemplate('specialNuTs').schema.key ).to.equal( '' );
			expect( nuts.getTemplate('specialNuTs').schema.nuAtts.key ).to.not.exist;
			done();
		});
	});
});
