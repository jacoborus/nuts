'use strict';

var fs = require('fs'),
	path = require('path'),
	recursive = require('recursive-readdir'),
	compileTag = require('./compiler.js').compileTag,
	compileLayout = require('./compiler.js').compileLayout,
	createTemplate = require('./template.js'),
	templates = require('./compiler.js').templates,
	layouts = require('./compiler.js').layouts,
	filters = require('./compiler.js').filters,
	Prom = require('./promise.js');


var allCompiled = false;

var newCounter = function (limit, next) {
	var count = 0;
	return function (err) {
		if (err) {return next( err );}
		if (++count === limit) {
			next();
		}
	};
};

var views = {};


/*!
 * Nuts constructor
 */
var Nuts = function () {
	Prom.create( this, ['addTemplate', 'addFile', 'addFolder', 'addTree', 'addFilters']);
};


/**
 * Add templates from given `string` to templates archive
 *
 * Example:
 * ```js
 * nuts.addTemplate(  '<span nut="super-span" nu-model="fruit"><span>' );
 * ```
 *
 * @param {String} source html with nut templates
 * @return {Object}      promise
 */

Nuts.prototype.addTemplate = function (source, callback) {
	createTemplate( source, function (err, tmpls) {
		if (err) { return callback( err ); }

		allCompiled = false;

		tmpls.forEach( function (tmpl) {
			if (tmpl.layout) {
				return (layouts[tmpl.nut] = tmpl);
			}
			templates[tmpl.nut] = tmpl;
		});
		callback();
	});
};



/**
 * Add templates from html file
 *
 * Example:
 * ```js
 * nuts
 * .addFile( 'core-templates.html' )
 * .addFile( 'calendar-templates.html' );
 * // => return promise
 * ```
 *
 * @param {String}   route templates file path
 * @return {Object}      promise
 */
Nuts.prototype.addFile = function (route, callback) {
	var self = this;
	fs.readFile( path.resolve(route), 'utf8', function (err, data) {
		if (err) {return callback( err );}
		self.addTemplate( data, callback );
	});
};

/**
 * Get a object template from templates archive
 *
 * Example:
 * ```js
 * nuts.getTemplate( 'super-span' );
 * ```
 * @param  {String} name template keyname
 * @return {Object}      template object
 */
Nuts.prototype.getTemplate = function (name) {
	return templates[name] || layouts[name];
};


/**
 * Add all templates from files within a folder
 *
 * Example:
 * ```js
 * nuts.addFolder( './templates' );
 * ```
 * @param {String}   folder  path to folder
 * @return {Object}      promise
 */
Nuts.prototype.addFolder = function (folder, callback) {

	var self = this;

	// get all files inside folderPath
	recursive( folder, function (error, files) {
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
			self.addFile( filePath, function (err) {
				counter( err );
			});
		});
	});
};

/**
 * Add all templates in a folder using its filename paths as template keynames.
 * This operation only allow a template each file
 *
 * Example:
 * ```js
 * nuts.addTree( './layouts' );
 * ```
 *
 * @param {String}   folderPath route to folder
 * @return {Object}      promise
 */
Nuts.prototype.addTree = function (folderPath, callback) {

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
					tmpls.forEach( function (tmpl) {
						if (tmpl.layout) {
							return (layouts[namePath] = tmpl);
						}
						templates[namePath] = tmpl;
					});
					counter(null);
				});
			});
		});
	});

};

/**
 * Get a rendered template
 *
 * Example:
 * ```js
 * var tmpl = '<span nut="simpleTag">hola</span>';
 * var html;
 *
 * nuts
 * .addTemplate( tmpl )
 * .exec( function (err) {
 *     html = nuts.render( 'simpleTag', {} );
 *     // html === '<span>hola</span>'
 * });
 * ```
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

/**
 * Add filters to filters archive
 *
 * Example:
 * ```js
 * nuts.addFilters({
 * 		templatename: {
 * 			fieldName: function (val, scope) {
 * 				return 'get ' + val + '!';
 * 			}
 * 		}
 * });
 * ```
 * @param {Object} filters
 * @return {Object}      promise
 */
Nuts.prototype.addFilters = function (filts, callback) {
	var i;
	for (i in filts) {
		filters[i] = filts[i];
	}
	return callback();
};


module.exports = new Nuts();
