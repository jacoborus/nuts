'use strict';

var expect = require('chai').expect,
	nuts = require('../index.js');


describe( 'Loop', function () {

	it('render simple array loops', function () {

		var tmpl = '<ul nut="arrLoop" nu-scope="nums"><li nu-repeat nu-model></li></ul>';
		nuts.addTemplate( tmpl, function () {
			expect(
				nuts.render( 'arrLoop', { nums: [1,2,3]})
			).to.equal(
				'<ul><li>1</li><li>2</li><li>3</li></ul>'
			);
		});
	});

	it('render loops through repeat scope array', function () {
		var tmpl = '<ul nut="arrLoopScoped"><li nu-repeat="nums" nu-model></li></ul>';
		nuts.addTemplate( tmpl, function () {
			expect(
				nuts.render( 'arrLoopScoped', { nums: [1,2,3]})
			).to.equal(
				'<ul><li>1</li><li>2</li><li>3</li></ul>'
			);
		});
	});

	it('render render keys when loop an object', function () {
		var tmpl = '<ul nut="loopKey">'+
				'<li nu-repeat="nums">'+
					'<span nu-key></span>'+
					'<span nu-model></span>'+
				'</li>'+
			'</ul>';
		nuts.addTemplate( tmpl, function () {
			expect(
				nuts.render( 'loopKey', { nums:
					{one:'one1',two:'two2',three:'three3'}
				})
			).to.equal(
				'<ul>'+
					'<li><span>one</span><span>one1</span></li>' +
					'<li><span>two</span><span>two2</span></li>' +
					'<li><span>three</span><span>three3</span></li>' +
				'</ul>'
			);
		});
	});
});
