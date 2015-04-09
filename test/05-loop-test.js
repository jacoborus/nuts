'use strict';

var expect = require('chai').expect,
	nuts = require('../index.js');


describe( 'Loop:', function () {
	describe( 'Repeat:', function () {

		it('render simple array loops', function (done) {

			var tmpl = '<ul nut="arrLoop" nu-scope="nums"><li nu-repeat nu-model></li></ul>';
			nuts
			.addTemplate( tmpl )
			.exec( function () {
				expect(
					nuts.render( 'arrLoop', { nums: [1,2,3]})
				).to.equal(
					'<ul><li>1</li><li>2</li><li>3</li></ul>'
				);
				done();
			});
		});

		it('render loops through repeat scope array', function (done) {
			var tmpl = '<ul nut="arrLoopScoped"><li nu-repeat="nums" nu-model></li></ul>';
			nuts
			.addTemplate( tmpl )
			.exec( function () {
				expect(
					nuts.render( 'arrLoopScoped', { nums: [1,2,3]})
				).to.equal(
					'<ul><li>1</li><li>2</li><li>3</li></ul>'
				);
				done();
			});
		});
	});

	describe( 'Each:', function () {

		it('render simple array loops', function (done) {

			var tmpl = '<ul nut="eachLoop" nu-scope="nums" nu-each>' +
					'<li nu-model></li>' +
				'</ul>';
			nuts
			.addTemplate( tmpl )
			.exec( function () {
				expect(
					nuts.render( 'eachLoop', { nums: [1,2,3]})
				).to.equal(
					'<ul><li>1</li><li>2</li><li>3</li></ul>'
				);
				done();
			});
		});

		it('render loops through repeat scope array', function (done) {
			var tmpl = '<ul nu-each="nums" nut="eachLoopScoped"><li nu-model></li></ul>';
			nuts
			.addTemplate( tmpl )
			.exec( function () {
				expect(
					nuts.render( 'eachLoopScoped', { nums: [1,2,3]})
				).to.equal(
					'<ul><li>1</li><li>2</li><li>3</li></ul>'
				);
				done();
			});
		});
	});
});
