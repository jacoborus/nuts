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
		var tmpl = '<span id="id" nu-att="nuid">hello</span>';
		nuts.addTemplate( 'separateAtts', tmpl, function (err) {
			expect( err ).to.equal( null );
			expect( nuts.getTemplate('separateAtts').schema.attribs.id ).to.equal( 'id' );
			expect( nuts.getTemplate('separateAtts').schema.nuAtts.att ).to.equal( 'nuid' );
			done();
		});
	});

	it('distribute special nuts attributes', function (done) {
		var tmpl = '<span ' +
			'class="class" ' +
			'nu-class="nuclass" ' +
			'nu-scope="scope" ' +
			'nu-extend="extend" ' +
			'nu-model="model" ' +
			'nu-key ' +
			'nu-pipe="pipe"' +
			'nu-if="if" ' +
			'nu-unless="unless" ' +
			'nu-doctype ' +
			'nu-checked="checked"' +
			'nu-is' +
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
			expect( nuts.getTemplate('specialNuTs').schema.pipe ).to.equal( 'pipe' );
			expect( nuts.getTemplate('specialNuTs').schema.nuAtts.pipe ).to.not.exist;
			expect( nuts.getTemplate('specialNuTs').schema.nuif ).to.equal( 'if' );
			expect( nuts.getTemplate('specialNuTs').schema.nuAtts.nuif ).to.not.exist;
			expect( nuts.getTemplate('specialNuTs').schema.unless ).to.equal( 'unless' );
			expect( nuts.getTemplate('specialNuTs').schema.nuAtts.unless ).to.not.exist;
			expect( nuts.getTemplate('specialNuTs').schema.key ).to.equal( '' );
			expect( nuts.getTemplate('specialNuTs').schema.nuAtts.key ).to.not.exist;
			expect( nuts.getTemplate('specialNuTs').schema.doctype ).to.equal( true );
			expect( nuts.getTemplate('specialNuTs').schema.nuAtts.doctype ).to.not.exist;
			expect( nuts.getTemplate('specialNuTs').schema.checked ).to.equal( 'checked' );
			expect( nuts.getTemplate('specialNuTs').schema.nuAtts.checked ).to.not.exist;
			expect( nuts.getTemplate('specialNuTs').schema.nuAtts.is ).to.not.exist;
			done();
		});
	});

	it('separate regular attributes with nuNamesake', function (done) {
		var tmpl = '<span id="id" nu-id="nuid">hello</span>';
		nuts.addTemplate( 'separateNamesakes', tmpl, function (err) {
			expect( err ).to.equal( null );
			expect( nuts.getTemplate('separateNamesakes').schema.attribs.id ).to.not.exist;
			expect( nuts.getTemplate('separateNamesakes').schema.namesakes.id ).to.equal( 'id' );
			expect( nuts.getTemplate('separateNamesakes').schema.nuAtts.id ).to.not.exist;
			expect( nuts.getTemplate('separateNamesakes').schema.nuSakes.id ).to.equal( 'nuid' );
			done();
		});
	});
});
