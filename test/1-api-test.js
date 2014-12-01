'use strict';

var expect = require('chai').expect,
	nuts = require('../index.js');


describe( 'nuts.addTemplate', function () {

	it('add src to a new template in templates archive', function (done) {
		var tmpl = '<span nut="one">hello</span>';
		nuts.addTemplate( tmpl, function (err) {
			expect( err ).to.equal( null );
			expect( nuts.getTemplate('one').src ).to.equal( '<span nut="one">hello</span>' );
			done();
		});
	});
});


describe( 'nuts.addFile', function () {

	it('add template from file', function (done) {
		nuts.addFile( './test/assets/basic.html', function (err) {
			expect( err ).to.equal( null );
			expect( nuts.getTemplate('two').src ).to.equal( '<span nut="two">hello</span>' );
			done();
		});
	});
});


describe( 'nuts.addFolder', function () {

	it('add templates from folder with its filename as templatename', function (done) {
		nuts.addFolder( './test/assets/folder', function (err) {
			expect( err ).to.equal( null );
			expect( nuts.getTemplate('folderone').src ).to.equal( '<span nut="folderone">hello</span>' );
			expect( nuts.getTemplate('foldertwo').src ).to.equal( '<span nut="foldertwo">hello</span>' );
			done();
		});
	});
});


