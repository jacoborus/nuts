'use strict';

var expect = require('chai').expect,
	nuts = require('../index.js');

describe( 'Filter', function () {
	it('Filter simple data', function (done) {
		var tmpl = '<span nu-model="word" nut="simpleFilter"></span>';
		nuts
		.addTemplate( tmpl )
		.addFilters({
			simpleFilter:{
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

	it('add multiple filters', function (done) {
		var tmpl1 = '<span nu-model="word" nut="multiFilter1"></span>';
		var tmpl2 = '<span nu-model="word" nut="multiFilter2"></span>';
		nuts
		.addTemplate( tmpl1 )
		.addTemplate( tmpl2 )
		.addFilters({
			multiFilter1: {
				word: function (field, scope) {
					return 'get ' + field + '!';
				}
			},
			multiFilter2: {
				word: function (field, scope) {
					return 'get ' + field + '!';
				}
			}
		})
		.exec( function () {
			var rendered = nuts.render( 'multiFilter2', { word: 'nuts'});
			expect( rendered ).to.equal(
				'<span>get nuts!</span>'
			);
			done();
		});
	});


	it('Filter looped data', function (done) {
		var loopedFilterTmpl = '<ul nut="loopedFilter">'+
				'<li nu-repeat="nums" nu-model></li>' +
			'</ul>';
		nuts
		.addTemplate( loopedFilterTmpl )
		.addFilters({
			loopedFilter: {
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
