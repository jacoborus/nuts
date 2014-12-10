'use strict';

var expect = require('chai').expect,
	nuts = require('../index.js');


describe( 'nuts.addTemplate', function () {

	it('add src to a new template in templates archive', function (done) {
		var tmpl = '<span nut="one">hello</span>';
		nuts
		.addTemplate( tmpl )
		.exec( function (err) {
			expect( err ).to.equal( undefined );
			expect( nuts.getTemplate('one').src ).to.equal(
				'<span nut="one">hello</span>'
			);
			done();
		});
	});

	it('add several templates from a single string', function (done) {
		var tmpl = '<span nut="three">hello</span><span nut="four">hello</span>';
		nuts
		.addTemplate( tmpl )
		.exec( function (err) {
			expect( err ).to.equal( undefined );
			expect( nuts.getTemplate('three').src ).to.equal(
				'<span nut="three">hello</span><span nut="four">hello</span>'
			);
			expect( nuts.getTemplate('four').src ).to.equal(
				'<span nut="three">hello</span><span nut="four">hello</span>'
			);
			done();
		});
	});
});


describe( 'nuts.addFile', function () {

	it('add template from file', function (done) {
		nuts
		.addFile( './test/assets/basic.html' )
		.exec( function (err) {
			expect( err ).to.equal( undefined );
			expect( nuts.getTemplate('two').src ).to.equal(
				'<span nut="two">hello</span>'
			);
			done();
		});
	});
});


describe( 'nuts.addFolder', function () {

	it('add templates from folder with its filename as templatename', function (done) {
		nuts
		.addFolder( './test/assets/folder' )
		.exec( function (err) {
			expect( err ).to.equal( undefined );
			expect( nuts.getTemplate('folderone').src ).to.equal(
				'<span nut="folderone">hello</span>'
			);
			expect( nuts.getTemplate('foldertwo').src ).to.equal(
				'<span nut="foldertwo">hello</span>'
			);
			done();
		});
	});
});


describe( 'nuts.addTree', function () {

	it('add templates from folder with its filename as templatename', function (done) {
		nuts
		.addTree( './test/assets' )
		.exec( function (err) {
			expect( err ).to.equal( undefined );
			expect( nuts.getTemplate('basic.html').src ).to.equal(
				'<span nut="two">hello</span>'
			);
			expect( nuts.getTemplate('folder/foldertwo.html').src ).to.equal(
				'<span nut="foldertwo">hello</span>'
			);
			done();
		});
	});
});


