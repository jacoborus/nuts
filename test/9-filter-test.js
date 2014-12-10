'use strict';

var expect = require('chai').expect,
	nuts = require('../index.js');

describe( 'Filter', function () {
	it('Filter simple data', function (done) {
		var simpleFilter = '<span nu-model="word" nut="simpleFilter"></span>';
		nuts
		.addTemplate( simpleFilter )
		.addFilter({
			name: 'simpleFilter',
			filter: {
				word: function (field, scope) {
					return 'get ' + field + '!';
				}
			}
		})
		.exec( function () {
			var rendered = nuts.render( 'simpleFilter', { word: 'nuts'});
			expect( rendered ).to.equal(
				'<span>get nuts!</span>'
			);
			done();
		});
	});


	it('Filter looped data', function (done) {
		var loopedFilter = '<ul nut="loopedFilter">'+
				'<li nu-repeat="nums" nu-model></li>' +
			'</ul>';
		nuts
		.addTemplate( loopedFilter )
		.addFilter({
			name: 'loopedFilter',
			filter: {
				nums: function (val, scope) {
					var i;
					for (i in val) {
						val[i] = val[i] + 1;
					}
					return val;
				}
			}
		})
		.exec( function () {
			var rendered = nuts.render( 'loopedFilter', { nums: [1,2,3]});
			expect( rendered ).to.equal(
				'<ul>'+
					'<li>2</li>' +
					'<li>3</li>' +
					'<li>4</li>' +
				'</ul>'
			);
			done();
		});
	});
});
