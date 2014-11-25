'use strict';

var expect = require('chai').expect,
	nuts = require('../index.js');


describe( 'nuts.addTemplate', function () {

	it('add src to a new template in templates archive', function (done) {
		var tmpl = '<span>hello</span>';
		nuts.addTemplate( 'one', tmpl, function (err) {
			expect( err ).to.equal( null );
			expect( nuts.getTemplate('one').src ).to.equal( '<span>hello</span>' );
			done();
		});
	});
});


describe( 'nuts.addFile', function () {

	it('add template from file', function (done) {
		nuts.addFile( 'two', './test/assets/basic.html', function (err) {
			expect( err ).to.equal( null );
			expect( nuts.getTemplate('two').src ).to.equal( '<span>hello</span>' );
			done();
		});
	});
});


describe( 'nuts.addFolder', function () {

	it('add templates from folder with its filename as templatename', function (done) {
		nuts.addFolder( './test/assets/folder', function (err) {
			expect( err ).to.equal( null );
			expect( nuts.getTemplate('folderone').src ).to.equal( '<span>hello</span>' );
			expect( nuts.getTemplate('foldertwo').src ).to.equal( '<span>hello</span>' );
			done();
		});
	});
});


