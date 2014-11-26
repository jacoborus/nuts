'use strict';

var expect = require('chai').expect,
	nuts = require('../index.js');


describe( 'Loop', function () {

	it('render simple array loops', function () {

		var tmpl = '<ul nu-scope="nums"><li nu-repeat nu-model></li></ul>';
		nuts.addTemplate( 'arrLoop', tmpl, function () {
			expect(
				nuts.render( 'arrLoop', { nums: [1,2,3]})
			).to.equal(
				'<ul><li>1</li><li>2</li><li>3</li></ul>'
			);
		});
	});

	it('render loops through repeat scope array', function () {
		var tmpl = '<ul><li nu-repeat="nums" nu-model></li></ul>';
		nuts.addTemplate( 'arrLoopScoped', tmpl, function () {
			expect(
				nuts.render( 'arrLoopScoped', { nums: [1,2,3]})
			).to.equal(
				'<ul><li>1</li><li>2</li><li>3</li></ul>'
			);
		});
	});

	it('render render keys when loop an object', function () {
		var tmpl = '<ul>'+
				'<li nu-repeat="nums">'+
					'<span nu-key></span>'+
					'<span nu-model></span>'+
				'</li>'+
			'</ul>';
		nuts.addTemplate( 'loopKey', tmpl, function () {
			expect(
				nuts.render( 'loopKey', { nums: {one:1,two:2,three:3}})
			).to.equal(
				'<ul>'+
					'<li><span>one</span><span>1</span></li>' +
					'<li><span>two</span><span>2</span></li>' +
					'<li><span>three</span><span>3</span></li>' +
				'</ul>'
			);
		});
	});
});
