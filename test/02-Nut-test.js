'use strict';

var expect = require('chai').expect,
	parser = require('../src/parser.js'),
	Nut = require('../src/Nut.js');



describe( 'Nut', function () {


	it('contain parent nuts, render, compile and name', function (done) {
		var tmpl = '<ul nut="simpleTag"></ul>';

		parser( tmpl, function (err, parsed) {
			var nut = new Nut( parsed[0], 5 );
			expect( nut.nuts ).to.equal( 5 );
			expect( nut.nutName ).to.equal( 'simpleTag' );
			expect( nut.render ).to.equal( false );
			expect( nut.compile ).to.be.a( 'function' );
			done();
		});
	});

	it('generate a nut from template string', function (done) {
		var tmpl = '<ul nut="simpleTag"></ul>';

		parser( tmpl, function (err, parsed) {
			var nut = new Nut( parsed[0] );
			expect( nut.type ).to.equal( 'tag' );
			expect( nut.name ).to.equal( 'ul' );
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
			var nut = new Nut( parsed[0] );

			expect( err ).to.not.be.ok;
			// class
			expect( nut.classes ).to.equal( 'class' );
			expect( nut.nuAtts.class ).to.not.exist;
			// nuClass
			expect( nut.nuClass ).to.equal( 'nuclass' );
			// scope
			expect( nut.scope ).to.equal( 'scope' );
			expect( nut.nuAtts.scope ).to.not.exist;
			// model
			expect( nut.model ).to.equal( 'model' );
			expect( nut.nuAtts.model ).to.not.exist;
			// inherit
			expect( nut.inherit ).to.equal( 'inherit' );
			expect( nut.nuAtts.inherit ).to.not.exist;
			// nuif
			expect( nut.nuif ).to.equal( 'if' );
			expect( nut.nuAtts.nuif ).to.not.exist;
			// unless
			expect( nut.unless ).to.equal( 'unless' );
			expect( nut.nuAtts.unless ).to.not.exist;
			// repeat
			expect( nut.repeat ).to.equal( 'repeat' );
			expect( nut.nuAtts.repeat ).to.not.exist;
			// each
			expect( nut.each ).to.equal( 'each' );
			expect( nut.nuAtts.each ).to.not.exist;
			// layout
			expect( nut.layout ).to.equal( 'layout' );
			expect( nut.nuAtts.layout ).to.not.exist;
			// block
			expect( nut.block ).to.equal( 'head' );
			expect( nut.nuAtts.block ).to.not.exist;
			// as
			expect( nut.as ).to.equal( 'as' );
			expect( nut.nuAtts.as ).to.not.exist;
			// extend
			expect( nut.extend ).to.equal( 'extend' );
			expect( nut.nuAtts.extend ).to.not.exist;
			// nut
			expect( nut.nutName ).to.equal( 'specialNuTs' );
			expect( nut.attribs.nut ).to.not.exist;
			// as
			expect( nut.nuAtts.as ).to.not.exist;
			// doctype
			expect( nut.doctype ).to.equal(false);
			done();
		});
	});


	it('separate nuts attributes from regular ones', function (done) {
		var tmpl = '<span id="id" nu-att="nuid" nut="separateAtts">hello</span>';

		parser( tmpl, function (err, parsed) {
			var schema = new Nut( parsed[0] );
			expect( err ).to.not.be.ok;
			expect( schema.attribs.id ).to.equal( 'id' );
			expect( schema.nuAtts.att ).to.equal( 'nuid' );
			done();
		});
	});


	it('separate regular attributes with nuNamesake', function (done) {
		var tmpl = '<span id="id" nu-id="nuid" nut="separateNamesakes">hello</span>';
		parser( tmpl, function (err, parsed) {
			var schema = new Nut( parsed[0] );
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
			var schema = new Nut( parsed[0] );
			expect( err ).to.not.be.ok;
			expect( schema.children ).to.be.a( 'array' );
			done();
		});
	});

	it('add boolean attributes to schema', function (done) {
		var tmpl = '<span nut="booleans" nu-bool-="myboolean">hello</span>';
		parser( tmpl, function (err, parsed) {
			var schema = new Nut( parsed[0] );
			expect( err ).to.be.falsy;
			expect( schema.booleans.bool ).to.equal( 'myboolean' );
			done();
		});
	});

	describe( 'doctypes', function () {

		it('detect HTML5', function (done) {
			var tmpl = '<html nu-doctype></html><html nu-doctype="5"></html>';
			parser( tmpl, function (err, parsed) {
				var schema0 = new Nut( parsed[0] ),
					schema1 = new Nut( parsed[1] );
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
				var schema0 = new Nut( parsed[0] ),
					schema1 = new Nut( parsed[1] );
				expect( err ).to.not.be.ok;
				expect( schema0.doctype ).to.equal( '4s' );
				expect( schema1.doctype ).to.equal( '4s' );
				done();
			});
		});
		it('detect HTML4 Transactional', function (done) {
			var tmpl = '<html nu-doctype="4t"></html>';
			parser( tmpl, function (err, parsed) {
				var schema0 = new Nut( parsed[0] );
				expect( err ).to.not.be.ok;
				expect( schema0.doctype ).to.equal( '4t' );
				done();
			});
		});
		it('detect HTML4 Frameset', function (done) {
			var tmpl = '<html nu-doctype="4f"></html>';
			parser( tmpl, function (err, parsed) {
				var schema0 = new Nut( parsed[0] );
				expect( err ).to.not.be.ok;
				expect( schema0.doctype ).to.equal( '4f' );
				done();
			});
		});
		// XHTML1.0
		it('detect XHTML1.0 Strict', function (done) {
			var tmpl = '<html nu-doctype="x"></html><html nu-doctype="xs"></html>';
			parser( tmpl, function (err, parsed) {
				var schema0 = new Nut( parsed[0] ),
					schema1 = new Nut( parsed[1] );
				expect( err ).to.not.be.ok;
				expect( schema0.doctype ).to.equal( 'xs' );
				expect( schema1.doctype ).to.equal( 'xs' );
				done();
			});
		});
		it('detect XHTML1.0 Transactional', function (done) {
			var tmpl = '<html nu-doctype="xt"></html>';
			parser( tmpl, function (err, parsed) {
				var schema0 = new Nut( parsed[0] );
				expect( err ).to.not.be.ok;
				expect( schema0.doctype ).to.equal( 'xt' );
				done();
			});
		});
		it('detect XHTML1.0 Frameset', function (done) {
			var tmpl = '<html nu-doctype="xf"></html>';
			parser( tmpl, function (err, parsed) {
				var schema0 = new Nut( parsed[0] );
				expect( err ).to.not.be.ok;
				expect( schema0.doctype ).to.equal( 'xf' );
				done();
			});
		});
		// XHTML1.1
		it('detect XHTML1.1', function (done) {
			var tmpl = '<html nu-doctype="xx"></html><html nu-doctype="11"></html>';
			parser( tmpl, function (err, parsed) {
				var schema0 = new Nut( parsed[0] ),
					schema1 = new Nut( parsed[1] );
				expect( err ).to.not.be.ok;
				expect( schema0.doctype ).to.equal( 'xx' );
				expect( schema1.doctype ).to.equal( 'xx' );
				done();
			});
		});
	});
});
