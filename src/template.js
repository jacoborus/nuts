'use strict';

var htmlparser = require('htmlparser2'),
	TagSchema = require('./schema.js').TagSchema,
	LayoutSchema = require('./schema.js').LayoutSchema;

var templates = require('./compiler.js').templates,
	layouts = require('./compiler.js').layouts;




var newNext = function (limit, callback) {
	var count = 0,
		tmpls = [];
	return function (err, tmpl) {
		if (err) { return callback( err );}
		tmpls.push( tmpl );
		if (++count === limit) {
			callback( null, tmpls );
		}
	}
};

var prepare = function (dom, src, next) {
	var isLayout = dom.name === 'template' && dom.attribs['nu-layout'],
		schema;

	var nutName = dom.attribs ? dom.attribs.nut : null;

	if (nutName) {
		delete dom.attribs.nut;
	}


	var tmp = {
		src : src,
		nut: nutName,
		schema: isLayout ? new LayoutSchema( dom ) : new TagSchema( dom ),
		layout: isLayout
	};
	next( null, tmp );
};

var save = function (doms) {
	var dom,
		lays = {};
	for (dom in doms) {

	}
};

/*!
 * generate a template object with its source and model as properties
 * @param  {String}   src      html template
 * @param  {Function} callback Signature: error, generatedTemplate
 */
var createTemplate = function (src, callback) {
	var handler = new htmlparser.DomHandler( function (error, dom) {
		if (error) { return callback( error );}

		var next = newNext( dom.length, function (err, tmpls) {
			callback( err, tmpls );
		});

		var i;
		for (i in dom) {
			prepare( dom[i], src, next );
		}
	}, {normalizeWhitespace: true});

	var parser = new htmlparser.Parser( handler );
	parser.write( src );
	parser.done();
};

module.exports = createTemplate;