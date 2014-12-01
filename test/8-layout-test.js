'use strict';

var expect = require('chai').expect,
	nuts = require('../index.js');

describe( 'Layout', function (done) {

	it('print layouts with default blocks when no data passed', function (done) {

		var layout = '<template nu-layout="tagLayout"></template>';

		nuts.addTemplate( 'simpleLayout', layout, function () {
			expect(
				nuts.render( 'simpleLayout' )
			).equal('<html>' +
				'<body block="body">hello</body>' +
				'</html>'
			);
			done();
		});

	});

	it('replace() templates');
	it('content() templates');
	it('append() templates');
	it('prepend() templates');
});
