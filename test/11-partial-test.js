'use strict';
var path = require('path');
var expect = require('chai').expect,
	Nuts = require('../src/Nuts.js');


describe.skip( 'Partial', function () {
	it('render simple partials', function (done) {
		var nuts = new Nuts();
		var tmpl = '<ul nut="simplePartialUl"><li nu-as="simplePartialLi"></li></ul>' +
			'<li nut="simplePartialLi" yeah="yeah">nuts</li>';
		nuts
		.addNuts( tmpl )
		.compile( function () {
			nuts.render( 'simplePartialUl', {}, function (err, html) {
				expect( html ).to.equal( '<ul><li yeah="yeah">nuts</li></ul>' );
				done();
			});
		});
	});



	it('render complex partials', function (done) {
		var nuts = new Nuts();
		nuts
		.addFile( './test/assets/complex-partial.html' )
		.compile( function () {
			nuts.render( 'blogDemo', {
				articles: [{
					title: 'you are a nut'
				},{
					title: 'you are a nut'
				}]
			}, function (err, html) {
				expect( html ).to.equal( '<section><article><h1>you are a nut</h1></article><article><h1>you are a nut</h1></article></section>' );
				done();
			});
		});
	});
});
