'use strict';

var fs = require('fs'),
	path = require('path'),
	recursive = require('recursive-readdir'),
	compileTag = require('./compiler.js').compileTag,
	compileLayout = require('./compiler.js').compileLayout,
	createTemplate = require('./template.js'),
	templates = require('./compiler.js').templates,
	layouts = require('./compiler.js').layouts,
	filters = require('./compiler.js').filters;



var allCompiled = false;

var newCounter = function (limit, callback) {
	var count = 0;
	return function (err) {
		if (err) { callback( err );}
		if (++count === limit) {
			callback( null );
		}
	};
};

var views = {};

/*!
 * Nuts constructor
 */
var Nuts = function () {};


/**
 * Add a template and generate its model
 * @param {String}   source html template
 * @param {Function} callback    Signature: error
 */
Nuts.prototype.addTemplate = function (source, callback) {
	callback = callback || function () {};
	createTemplate( source, function (err, tmpls) {
		if (err) {
			return callback( err );
		}
		allCompiled = false;
		var i;
		for (i in tmpls) {
			if (tmpls[i].layout) {
				layouts[tmpls[i].nut] = tmpls[i];
			} else {
				templates[tmpls[i].nut] = tmpls[i];
			}
		}
		callback(null);
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
 * Add all templates in a folder
 * @param {String}   folderPath route to folder
 * @param {Function} callback   Signature: error
 */
Nuts.prototype.addFolder = function (folderPath, callback) {
	callback = callback || function () {};
	var self = this;

	// get all files inside folderPath
	recursive( folderPath, function (error, files) {
		if (!files) { return callback();}
		var limit = files.length;
		if (error) { return callback( error );}
		if (!limit) { return callback();}

		var counter = newCounter( limit, callback );
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
 * Add all templates in a folder using its filename paths as template keynames
 * @param {String}   folderPath route to folder
 * @param {Function} callback   Signature: error
 */
Nuts.prototype.addTree = function (folderPath, callback) {
	callback = callback || function () {};
	folderPath = path.resolve( folderPath );
	var cutPath = folderPath.length + 1;


	// get all files inside folderPath
	recursive( folderPath, function (error, files) {
		var limit = files.length;
		if (error) { return callback( error );}
		if (!limit) { return callback();}

		var counter = newCounter( limit, callback );
		// read files
		files.forEach( function (filePath) {
			var namePath = filePath.slice( cutPath, filePath.length );
			// exclude no .html files
			if (path.extname(filePath) !== '.html') {
				return counter();
			}
			fs.readFile( filePath, 'utf8', function (err, data) {
				if (err) { return counter( err );}
				createTemplate( data, function (err2, tmpls) {
					if (err2) {
						return counter( err2 );
					}
					allCompiled = false;
					var i;
					for (i in tmpls) {
						if (tmpls[i].layout) {
							layouts[namePath] = tmpls[i];
						} else {
							templates[namePath] = tmpls[i];
						}
					}
					counter(null);
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
	if (views[tmplName]) {
		return views[tmplName].render( data );
	}
	return '';
};



Nuts.prototype.addFilter = function (name, filter, callback) {
	filters[name] = filter;
	callback();
};


module.exports = new Nuts();
