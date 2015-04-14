'use strict';

var expect = require('chai').expect,
	parser = require('../src/parser.js'),
	Nut = require('../src/Nut.js');

describe( 'Nut', function () {

	it('contain parent nuts, schema and name', function (done) {
		var tmpl = '<ul nut="simpleTag"></ul>';

		parser( tmpl, function (err, parsed) {
			var nut = new Nut( parsed[0], 5 );
			expect( nut.nuts ).to.equal( 5 );
			expect( nut.name ).to.equal( 'simpleTag' );
			expect( nut.schema ).to.be.a( 'object' );
			expect( nut.render ).to.equal( false );
			expect( nut.compile ).to.be.a( 'function' );
			done();
		});
	});
});
