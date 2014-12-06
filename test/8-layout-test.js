'use strict';

var expect = require('chai').expect,
	nuts = require('../index.js');

describe( 'Layout', function (done) {

	it('print layouts with default blocks when no data passed', function (done) {

		var layout = '<template nu-layout="layout1" nut="simpleLayout"></template>';
		var tmpl = '<html nut="layout1">' +
				'<body nu-block="body">hello</body>' +
			'</html>';
		nuts.addTemplate( layout + tmpl, function () {
			expect(
				nuts.render( 'simpleLayout' )
			).equal('<html>' +
				'<body>hello</body>' +
				'</html>'
			);
			done();
		});
	});

	it('extend layout templates with blocks', function (done) {
		var layout = '<template nu-layout="tagExtend" nut="layoutExtend">' +
				'<template nu-block="body" nu-extend="blockExtend"></template>' +
			'</template>';
		var tmpl = '<html nut="tagExtend">' +
				'<body nu-block="body">hello</body>' +
			'</html>';
		var tmplBlock = '<body nut="blockExtend">' +
				'<p nu-model="text">bye</p>' +
			'</body>';

		nuts.addTemplate( layout + tmpl + tmplBlock, function (err) {
			expect( err ).to.not.exist;
			expect(
				nuts.render( 'layoutExtend', {text: 'nuts'} )
			).equal('<html><body>' +
					'<p>nuts</p>' +
				'</body></html>'
			);
			done();
		});
	});
});
