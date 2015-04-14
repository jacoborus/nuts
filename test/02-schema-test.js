'use strict';

var expect = require('chai').expect,
	parser = require('../src/parser.js'),
	Schema = require('../src/Schema.js');



describe( 'Schema', function () {

	it('generate a schema from template string', function (done) {
		var tmpl = '<ul nut="simpleTag"></ul>';

		parser( tmpl, function (err, parsed) {
			var schema = new Schema( parsed[0] );
			expect( schema.type ).to.equal( 'tag' );
			expect( schema.name ).to.equal( 'ul' );
			done();
		});

	});


	it('distribute special nuts attributes', function (done) {
		var tmpl = '<span' +
			' class="class"' +
			' nu-class="nuclass"' +
			// scopes
			' nu-scope="scope"' +
			' nu-model="model"' +
			' nu-inherit="inherit"' +
			// conditionals
			' nu-if="if"' +
			' nu-unless="unless"' +
			// iterations
			' nu-repeat="repeat"' +
			' nu-each="each"' +
			// layouts
			' nu-layout="layout"' +
			' nu-block="head"' +
			' nu-extend="extend"' +
			' nu-as="as"' +
			' nut="specialNuTs"' +
			'>' +
			'hello' +
			'</span>';

		parser( tmpl, function (err, parsed) {
			var schema = new Schema( parsed[0] );

			expect( err ).to.not.be.ok;
			// class
			expect( schema.classes ).to.equal( 'class' );
			expect( schema.nuAtts.class ).to.not.exist;
			// nuClass
			expect( schema.nuClass ).to.equal( 'nuclass' );
			// scope
			expect( schema.scope ).to.equal( 'scope' );
			expect( schema.nuAtts.scope ).to.not.exist;
			// model
			expect( schema.model ).to.equal( 'model' );
			expect( schema.nuAtts.model ).to.not.exist;
			// inherit
			expect( schema.inherit ).to.equal( 'inherit' );
			expect( schema.nuAtts.inherit ).to.not.exist;
			// nuif
			expect( schema.nuif ).to.equal( 'if' );
			expect( schema.nuAtts.nuif ).to.not.exist;
			// unless
			expect( schema.unless ).to.equal( 'unless' );
			expect( schema.nuAtts.unless ).to.not.exist;
			// repeat
			expect( schema.repeat ).to.equal( 'repeat' );
			expect( schema.nuAtts.repeat ).to.not.exist;
			// each
			expect( schema.each ).to.equal( 'each' );
			expect( schema.nuAtts.each ).to.not.exist;
			// layout
			expect( schema.layout ).to.equal( 'layout' );
			expect( schema.nuAtts.layout ).to.not.exist;
			// block
			expect( schema.block ).to.equal( 'head' );
			expect( schema.nuAtts.block ).to.not.exist;
			// as
			expect( schema.as ).to.equal( 'as' );
			expect( schema.nuAtts.as ).to.not.exist;
			// extend
			expect( schema.extend ).to.equal( 'extend' );
			expect( schema.nuAtts.extend ).to.not.exist;
			// nut
			expect( schema.nut ).to.equal( 'specialNuTs' );
			expect( schema.attribs.nut ).to.not.exist;
			// as
			expect( schema.nuAtts.as ).to.not.exist;
			// doctype
			expect( schema.doctype ).to.equal(false);
			done();
		});
	});


	it('separate nuts attributes from regular ones', function (done) {
		var tmpl = '<span id="id" nu-att="nuid" nut="separateAtts">hello</span>';

		parser( tmpl, function (err, parsed) {
			var schema = new Schema( parsed[0] );
			expect( err ).to.not.be.ok;
			expect( schema.attribs.id ).to.equal( 'id' );
			expect( schema.nuAtts.att ).to.equal( 'nuid' );
			done();
		});
	});


	it('separate regular attributes with nuNamesake', function (done) {
		var tmpl = '<span id="id" nu-id="nuid" nut="separateNamesakes">hello</span>';
		parser( tmpl, function (err, parsed) {
			var schema = new Schema( parsed[0] );
			expect( err ).to.not.be.ok;
			expect( schema.attribs.id ).to.not.exist;
			expect( schema.namesakes.id ).to.equal( 'id' );
			expect( schema.nuSakes.id ).to.equal( 'nuid' );
			expect( schema.nuAtts.id ).to.not.exist;
			done();
		});
	});

	it('add children to schema', function (done) {
		var tmpl = '<span nut="withchildren">hello</span>';
		parser( tmpl, function (err, parsed) {
			var schema = new Schema( parsed[0] );
			expect( err ).to.not.be.ok;
			expect( schema.children ).to.be.a( 'array' );
			done();
		});
	});

	it('add boolean attributes to schema', function (done) {
		var tmpl = '<span nut="booleans" nu-bool-="myboolean">hello</span>';
		parser( tmpl, function (err, parsed) {
			var schema = new Schema( parsed[0] );
			expect( err ).to.be.falsy;
			expect( schema.booleans.bool ).to.equal( 'myboolean' );
			done();
		});
	});

	describe( 'doctypes', function () {

		it('detect HTML5', function (done) {
			var tmpl = '<html nu-doctype></html><html nu-doctype="5"></html>';
			parser( tmpl, function (err, parsed) {
				var schema0 = new Schema( parsed[0] ),
					schema1 = new Schema( parsed[1] );
				expect( err ).to.not.be.ok;
				expect( schema0.doctype ).to.equal( '5' );
				expect( schema1.doctype ).to.equal( '5' );
				done();
			});
		});
		// HTML4
		it('detect HTML4 Strict', function (done) {
			var tmpl = '<html nu-doctype=4></html><html nu-doctype="4s"></html>';
			parser( tmpl, function (err, parsed) {
				var schema0 = new Schema( parsed[0] ),
					schema1 = new Schema( parsed[1] );
				expect( err ).to.not.be.ok;
				expect( schema0.doctype ).to.equal( '4s' );
				expect( schema1.doctype ).to.equal( '4s' );
				done();
			});
		});
		it('detect HTML4 Transactional', function (done) {
			var tmpl = '<html nu-doctype="4t"></html>';
			parser( tmpl, function (err, parsed) {
				var schema0 = new Schema( parsed[0] );
				expect( err ).to.not.be.ok;
				expect( schema0.doctype ).to.equal( '4t' );
				done();
			});
		});
		it('detect HTML4 Frameset', function (done) {
			var tmpl = '<html nu-doctype="4f"></html>';
			parser( tmpl, function (err, parsed) {
				var schema0 = new Schema( parsed[0] );
				expect( err ).to.not.be.ok;
				expect( schema0.doctype ).to.equal( '4f' );
				done();
			});
		});
		// XHTML1.0
		it('detect XHTML1.0 Strict', function (done) {
			var tmpl = '<html nu-doctype="x"></html><html nu-doctype="xs"></html>';
			parser( tmpl, function (err, parsed) {
				var schema0 = new Schema( parsed[0] ),
					schema1 = new Schema( parsed[1] );
				expect( err ).to.not.be.ok;
				expect( schema0.doctype ).to.equal( 'xs' );
				expect( schema1.doctype ).to.equal( 'xs' );
				done();
			});
		});
		it('detect XHTML1.0 Transactional', function (done) {
			var tmpl = '<html nu-doctype="xt"></html>';
			parser( tmpl, function (err, parsed) {
				var schema0 = new Schema( parsed[0] );
				expect( err ).to.not.be.ok;
				expect( schema0.doctype ).to.equal( 'xt' );
				done();
			});
		});
		it('detect XHTML1.0 Frameset', function (done) {
			var tmpl = '<html nu-doctype="xf"></html>';
			parser( tmpl, function (err, parsed) {
				var schema0 = new Schema( parsed[0] );
				expect( err ).to.not.be.ok;
				expect( schema0.doctype ).to.equal( 'xf' );
				done();
			});
		});
		// XHTML1.1
		it('detect XHTML1.1', function (done) {
			var tmpl = '<html nu-doctype="xx"></html><html nu-doctype="11"></html>';
			parser( tmpl, function (err, parsed) {
				var schema0 = new Schema( parsed[0] ),
					schema1 = new Schema( parsed[1] );
				expect( err ).to.not.be.ok;
				expect( schema0.doctype ).to.equal( 'xx' );
				expect( schema1.doctype ).to.equal( 'xx' );
				done();
			});
		});
	});
});
