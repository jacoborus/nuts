'use strict';
var expect = require('chai').expect,
	nuts = require('../index.js');


describe( 'nuts.addTemplate', function () {

	it('add src to a new template in templates archive', function (done) {
		var tmpl = '<span>hola</span>';
		nuts.addTemplate( 'one', tmpl, function (err, tmpls) {
			expect( err ).to.equal( null );
			expect( nuts.getTemplate('one').src ).to.equal( '<span>hola</span>' );
			done();
		});
	});
});

