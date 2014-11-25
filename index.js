'use strict';

var fs = require('fs'),
	path = require('path'),
	recursive = require('recursive-readdir'),
	htmlparser = require('htmlparser2');

var archive = {},
	allCompiled = false;

var newTemplate = function (src, callback) {
	var handler = new htmlparser.DomHandler( function (error, dom) {
		if (error) { return callback( error );}
		callback( null, {
			src : src,
			schema: dom[0]
		});
	}, {
		normalizeWhitespace: true
	});
	var parser = new htmlparser.Parser(handler);
	parser.write( src );
	parser.done();
};


/*!
 * Nuts constructor
 */
var Nuts = function () {};


/**
 * Adds and compiles a template
 * @param {String}   name        template keyname
 * @param {String}   templateSrc html template
 * @param {Function} callback    Signature: error, addedTemplate
 */
Nuts.prototype.addTemplate = function (name, templateSrc, callback) {
	callback = callback || function () {};
	newTemplate( templateSrc, function (err, tmpl) {
		if (err) {return callback( err );}
		archive[name] = tmpl;
		allCompiled = false;
		callback( null, tmpl );
	});
};


/**
 * Get a template object from archive
 * @param  {String} name template keyname
 * @return {Object}      template object
 */
Nuts.prototype.getTemplate = function (name) {
	return archive[name];
};


/**
 * Add a template from file
 * @param {String}   name         template keyname
 * @param {String}   route template path
 * @param {Function} callback     Signature: error, addedTemplate
 */
Nuts.prototype.addFile = function (name, route, callback) {
	var self = this;
	fs.readFile( path.resolve(route), 'utf8', function (err, data) {
		if (err) {return callback( err );}
		self.addTemplate( name, data, callback );
	});
};


module.exports = new Nuts();
