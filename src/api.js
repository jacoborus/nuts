'use strict';

var fs = require('fs'),
	path = require('path'),
	recursive = require('recursive-readdir'),
	compileTag = require('./compiler.js').compileTag,
	compileLayout = require('./compiler.js').compileLayout,
	createTemplate = require('./template.js');

var templates = require('./compiler.js').templates,
	layouts = require('./compiler.js').layouts,
	allCompiled = false;


var views = {};

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
Nuts.prototype.addTemplate = function (source, callback) {
	callback = callback || function () {};
	createTemplate( source, function (err, tmpl) {
		if (err) {return callback( err );}
		if (tmpl.layout) {
			layouts[tmpl.nut] = tmpl;
		} else {
			templates[tmpl.nut] = tmpl;
		}
		allCompiled = false;
		callback( null, tmpl );
	});
};


/**
 * Get a template object from templates
 * @param  {String} name template keyname
 * @return {Object}      template object
 */
Nuts.prototype.getTemplate = function (name) {
	return templates[name] || layouts[name];
};


/**
 * Add a template from file
 * @param {String}   name         template keyname
 * @param {String}   route template path
 * @param {Function} callback     Signature: error, addedTemplate
 */
Nuts.prototype.addFile = function (route, callback) {
	var self = this;
	fs.readFile( path.resolve(route), 'utf8', function (err, data) {
		if (err) {return callback( err );}
		self.addTemplate( data, callback );
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
			fs.readFile( filePath, 'utf8', function (err, data) {
				if (err) { return counter( err );}
				self.addTemplate( data, function (err) {
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
		for (i in templates) {
			templates[i].render = compileTag( templates[i] );
			views[i] = templates[i];
		}
		for (i in layouts) {
			layouts[i].render = compileLayout( layouts[i] );
			views[i] = layouts[i];
		}
		allCompiled = true;
	}
	return views[tmplName].render( data );
};


module.exports = new Nuts();
