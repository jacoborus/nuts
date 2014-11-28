'use strict';

var fs = require('fs'),
	path = require('path'),
	recursive = require('recursive-readdir'),
	htmlparser = require('htmlparser2'),
	compile = require('./compiler.js').compile,
	Schema = require('./schema.js');

var archive = require('./compiler.js').archive,
	allCompiled = false;


/*!
 * generate a template object with its source and model as properties
 * @param  {String}   src      html template
 * @param  {Function} callback Signature: error, generatedTemplate
 */
var newTemplate = function (src, callback) {
	var handler = new htmlparser.DomHandler( function (error, dom) {
		if (error) { return callback( error );}
		callback( null, {
			src : src,
			schema: new Schema( dom[0] )
		});
	}, {normalizeWhitespace: true});

	var parser = new htmlparser.Parser( handler );
	parser.write( src );
	parser.done();
};



/*!
 * Nuts constructor
 */
var Nuts = function () {};


/**
 * Add a template and generate its model
 * @param {String}   name        template keyname
 * @param {String}   source html template
 * @param {Function} callback    Signature: error, addedTemplate
 */
Nuts.prototype.addTemplate = function (name, source, callback) {
	callback = callback || function () {};
	newTemplate( source, function (err, tmpl) {
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


/**
 * Add all templates in a folder using its filenames as template keynames
 * @param {String}   folderPath route to folder
 * @param {Function} callback   Signature: error
 */
Nuts.prototype.addFolder = function (folderPath, callback) {
	callback = callback || function () {};
	var self = this,
		count = 0;

	// get all files inside folderPath
	recursive( folderPath, function (error, files) {
		var limit = files.length;
		if (error) { return callback( error );}
		if (!limit) { return callback();}

		var counter = function (err) {
			if (err) { callback( err );}
			if (++count === limit) {
				callback( null );
			}
		};
		// read files
		files.forEach( function (filePath) {
			// exclude no .html files
			if (path.extname(filePath) !== '.html') {
				return counter();
			}
			var name = path.basename( filePath, '.html');
			fs.readFile( filePath, 'utf8', function (err, data) {
				if (err) { return counter( err );}
				self.addTemplate( name, data, function (err) {
					counter( err );
				});
			});
		});
	});
};


/**
 * Get a rendered template
 * @param  {String} tmplName template keyname
 * @param  {Object} data     locals
 * @return {String}          rendered html
 */
Nuts.prototype.render = function (tmplName, data) {
	var i;
	data = data || {};
	if (!allCompiled) {
		for (i in archive) {
			archive[i].render = compile( archive[i] );
		}
		allCompiled = true;
	}
	return archive[tmplName].render( data );
};


module.exports = new Nuts();
