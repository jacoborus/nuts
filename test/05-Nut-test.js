'use strict';

var expect = require('chai').expect,
	parser = require('../src/parser.js'),
	Nut = require('../src/Nut.js');

var fn = function (){};

describe( 'Nut constructor', function () {

	it( 'initialize nut with source, nutName, nuts and type', function (done) {
		var tmpl = '<ul nut="simpleTag" nu-as="mypart"></ul>';
		parser( tmpl, function (err, parsed) {
			var nut = new Nut( parsed[ 0 ]);
			expect( nut.source.nutName ).to.equal( 'simpleTag' );
			expect( nut.nutName ).to.equal( 'simpleTag' );
			expect( nut.source.nutName ).to.equal( 'simpleTag' );
			expect( nut.partial ).to.equal( 'mypart' );
			done();
		});
	});

	it( 'add children to schema', function (done) {
		var tmpl = '<span nut="withchildren">hello</span>';
		parser( tmpl, function (err, parsed) {
			expect( err ).to.not.be.ok;
			var nut = new Nut( parsed[ 0 ]);
			expect( nut.children ).to.be.a( 'array' );
			done();
		});
	});
});
