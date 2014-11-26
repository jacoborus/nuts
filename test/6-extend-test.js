'use strict';

var expect = require('chai').expect,
	nuts = require('../index.js');


describe( 'Extend', function () {

	it('extend data with parent', function () {
		var tmpl = '<article nu-scope="person">' +
					'<h1 nu-model="name"></h1>'+
					'<div nu-scope="skills" nu-extend>' +
						'<span nu-model="js"></span>' +
						'<span nu-model="city"></span>' +
						'<span nu-model="name"></span>' +
					'</div>' +
				'</article>';
		nuts.addTemplate( 'directExtend', tmpl, function () {
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
				'</article>' );
		});
	});

	it('extend by select properties from parent', function () {
		var tmpl = '<article nu-scope="person">' +
					'<h1 nu-model="name"></h1>'+
					'<div nu-scope="skills" nu-extend="city">' +
						'<span nu-model="js"></span>' +
						'<span nu-model="city"></span>' +
						'<span nu-model="name"></span>' +
					'</div>' +
				'</article>';
		nuts.addTemplate( 'selectExtend', tmpl, function () {
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
				'</article>' );
		});
	});
});
