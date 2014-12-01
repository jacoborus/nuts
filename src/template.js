'use strict';

var htmlparser = require('htmlparser2'),
	TagSchema = require('./schema.js').TagSchema,
	LayoutSchema = require('./schema.js').LayoutSchema;

/*!
 * generate a template object with its source and model as properties
 * @param  {String}   src      html template
 * @param  {Function} callback Signature: error, generatedTemplate
 */
var createTemplate = function (src, callback) {
	var handler = new htmlparser.DomHandler( function (error, dom) {
		if (error) { return callback( error );}
		dom = dom[0];

		var isLayout = dom.name === 'template' && dom.attribs['nu-layout'],
			schema;

		if (isLayout) {
			schema = new LayoutSchema( dom );
		} else {
			schema = new TagSchema( dom );
		}

		callback( null, {
			src : src,
			schema: schema,
			layout: isLayout
		});
	}, {normalizeWhitespace: true});

	var parser = new htmlparser.Parser( handler );
	parser.write( src );
	parser.done();
};

module.exports = createTemplate;