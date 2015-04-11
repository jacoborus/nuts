'use strict';

var htmlparser = require('htmlparser2');

/*!
 * generate a template object with its source and model as properties
 * @param  {String}   src      html template
 * @param  {Function} callback Signature: error, parsedHTML
 */
module.exports = function (src, callback) {
	var handler = new htmlparser.DomHandler( function (error, dom) {
		if (error) { return callback( error );}
		callback( null, dom );
	}, { normalizeWhitespace: true });

	var parser = new htmlparser.Parser( handler );
	parser.write( src );
	parser.done();
};

