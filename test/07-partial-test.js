'use strict';
var path = require('path');
var expect = require('chai').expect,
	nuts = require('../index.js');


describe( 'Partial', function () {
	it('render simple partials', function (done) {
		var tmpl = '<ul nut="simplePartialUl"><li nu-as="simplePartialLi"></li></ul>' +
			'<li nut="simplePartialLi" yeah="yeah">nuts</li>';
		nuts
		.addTemplate( tmpl )
		.exec( function () {
			expect(
				nuts.render('simplePartialUl')
			).to.equal( '<ul><li yeah="yeah">nuts</li></ul>' );
			done();
		});
	});



	it('render complex partials', function (done) {
		nuts
		.addFile( './test/assets/complex-partial.html' )
		.exec( function () {
			expect(
				nuts.render('blogDemo', {
					articles: [{
						title: 'you are a nut'
					},{
						title: 'you are a nut'
					}]
				})
			).to.equal( '<section><article><h1>you are a nut</h1></article><article><h1>you are a nut</h1></article></section>' );
			done();
		});
	});
});
