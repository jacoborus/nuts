'use strict';

var expect = require('chai').expect,
	nuts = require('../index.js');


describe( 'Pipe', function () {

	it('extend data with parent', function (done) {
		var tmpl = '<article nu-scope="person" nut="directExtend">' +
				'<h1 nu-model="name"></h1>'+
				'<div nu-scope="skills" nu-pipe>' +
					'<span nu-model="js"></span>' +
					'<span nu-model="city"></span>' +
					'<span nu-model="name"></span>' +
				'</div>' +
			'</article>';
		nuts
		.addTemplate( tmpl )
		.exec( function () {
			expect(
				nuts.render( 'directExtend', { person:{
					name: 'Jacobo',
					city: 'DF',
					skills: {
						js: 9,
						html: 8
					}

				}})
			).to.equal( '<article>' +
				'<h1>Jacobo</h1>'+
				'<div>' +
				'<span>9</span>' +
				'<span>DF</span>' +
				'<span>Jacobo</span>' +
				'</div>' +
				'</article>'
			);
			done();
		});
	});

	it('extend by select properties from parent', function (done) {
		var tmpl = '<article nu-scope="person" nut="selectExtend">' +
					'<h1 nu-model="name"></h1>'+
					'<div nu-scope="skills" nu-pipe="city">' +
						'<span nu-model="js"></span>' +
						'<span nu-model="city"></span>' +
						'<span nu-model="name"></span>' +
					'</div>' +
				'</article>';
		nuts
		.addTemplate( tmpl )
		.exec( function () {
			expect(
				nuts.render( 'selectExtend', { person:{
					name: 'Jacobo',
					city: 'DF',
					skills: {
						js: 9,
						html: 8
					}

				}})
			).to.equal( '<article>' +
				'<h1>Jacobo</h1>'+
				'<div>' +
				'<span>9</span>' +
				'<span>DF</span>' +
				'<span></span>' +
				'</div>' +
				'</article>'
			);
			done();
		});
	});
});
