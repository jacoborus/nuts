'use strict';

var expect = require('chai').expect,
	nuts = require('../index.js');


describe( 'Template schema', function () {

	describe( 'Tag', function () {

		it('generate a schema from template string', function (done) {
			var tmpl = '<ul nut="simpleTag"></ul>';
			nuts.addTemplate( tmpl, function (err) {
				expect( err ).to.equal( null );
				expect( nuts.getTemplate('simpleTag').schema.type ).to.equal( 'tag' );
				expect( nuts.getTemplate('simpleTag').schema.name ).to.equal( 'ul' );
				done();
			});
		});

		it('separate nuts attributes from regular ones', function (done) {
			var tmpl = '<span id="id" nu-att="nuid" nut="separateAtts">hello</span>';
			nuts.addTemplate( tmpl, function (err) {
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
				'nu-pipe="pipe"' +
				'nu-if="if" ' +
				'nu-unless="unless" ' +
				'nu-doctype ' +
				'nu-checked="checked"' +
				'nu-block="head"' +
				'nu-as ' +
				'nut="specialNuTs"' +
				'>' +
				'hello' +
				'</span>';
			nuts.addTemplate( tmpl, function (err) {
				expect( err ).to.equal( null );
				// class
				expect( nuts.getTemplate('specialNuTs').schema.class ).to.equal( 'class' );
				expect( nuts.getTemplate('specialNuTs').schema.nuAtts.class ).to.not.exist;
				// nuClass
				expect( nuts.getTemplate('specialNuTs').schema.nuClass ).to.equal( 'nuclass' );
				// scope
				expect( nuts.getTemplate('specialNuTs').schema.scope ).to.equal( 'scope' );
				expect( nuts.getTemplate('specialNuTs').schema.nuAtts.scope ).to.not.exist;
				// model
				expect( nuts.getTemplate('specialNuTs').schema.model ).to.equal( 'model' );
				expect( nuts.getTemplate('specialNuTs').schema.nuAtts.model ).to.not.exist;
				// pipe
				expect( nuts.getTemplate('specialNuTs').schema.pipe ).to.equal( 'pipe' );
				expect( nuts.getTemplate('specialNuTs').schema.nuAtts.pipe ).to.not.exist;
				// nuif
				expect( nuts.getTemplate('specialNuTs').schema.nuif ).to.equal( 'if' );
				expect( nuts.getTemplate('specialNuTs').schema.nuAtts.nuif ).to.not.exist;
				// unless
				expect( nuts.getTemplate('specialNuTs').schema.unless ).to.equal( 'unless' );
				expect( nuts.getTemplate('specialNuTs').schema.nuAtts.unless ).to.not.exist;
				// doctype
				expect( nuts.getTemplate('specialNuTs').schema.doctype ).to.equal( true );
				expect( nuts.getTemplate('specialNuTs').schema.nuAtts.doctype ).to.not.exist;
				// block
				expect( nuts.getTemplate('specialNuTs').schema.block ).to.equal( 'head' );
				expect( nuts.getTemplate('specialNuTs').schema.nuAtts.block ).to.not.exist;
				// checked
				expect( nuts.getTemplate('specialNuTs').schema.checked ).to.equal( 'checked' );
				expect( nuts.getTemplate('specialNuTs').schema.nuAtts.checked ).to.not.exist;
				// nut
				expect( nuts.getTemplate('specialNuTs').nut ).to.equal( 'specialNuTs' );
				expect( nuts.getTemplate('specialNuTs').schema.attribs.nut ).to.not.exist;
				// as
				expect( nuts.getTemplate('specialNuTs').schema.nuAtts.as ).to.not.exist;
				done();
			});
		});

		it('separate regular attributes with nuNamesake', function (done) {
			var tmpl = '<span id="id" nu-id="nuid" nut="separateNamesakes">hello</span>';
			nuts.addTemplate( tmpl, function (err) {
				expect( err ).to.equal( null );
				expect( nuts.getTemplate('separateNamesakes').schema.attribs.id ).to.not.exist;
				expect( nuts.getTemplate('separateNamesakes').schema.namesakes.id ).to.equal( 'id' );
				expect( nuts.getTemplate('separateNamesakes').schema.nuAtts.id ).to.not.exist;
				expect( nuts.getTemplate('separateNamesakes').schema.nuSakes.id ).to.equal( 'nuid' );
				done();
			});
		});
	});

	describe( 'Layout', function () {

		it('generate a different schema for layouts', function (done) {
			var tmpl = '<html nut="tagLayout">' +
				'<body nu-block="body">hello</body>' +
				'</html>';
			var layout = '<template nu-layout="tagLayout" nut="layoutSchema">' +
					'<template nu-block="head" nu-extend="headTitle"></template>' +
				'</template>';
			nuts.addTemplate( tmpl, function () {
				nuts.addTemplate( layout, function (err) {
					expect( err ).to.equal( null );
					expect( nuts.getTemplate('layoutSchema').schema.extend ).to.equal( 'tagLayout' );
					expect( nuts.getTemplate('layoutSchema').schema.blocks.head ).to.be.a( 'object' );
					expect( nuts.getTemplate('layoutSchema').schema.blocks.head.extend ).to.equal( 'headTitle' );
					done();
				});
			});

		});
	});
});
