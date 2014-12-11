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

var newCounter = function (limit, prom) {
	var count = 0;
	return function (err) {
		if (err) {return prom.next( err );}
		if (++count === limit) {
			prom.next( null );
		}
	};
};

var views = {};

/**
 * Add a template and generate its model
 * @param {String}   source html template
 * @param {Function} callback    Signature: error
 */
var _addTemplate = function (source, prom) {
	createTemplate( source, function (err, tmpls) {
		if (err) { return prom.next( err ); }

		allCompiled = false;
		var i;
		for (i in tmpls) {
			if (tmpls[i].layout) {
				layouts[tmpls[i].nut] = tmpls[i];
			} else {
				templates[tmpls[i].nut] = tmpls[i];
			}
		}
		prom.next();
	});
};

var _addFile = function (route, prom) {
	fs.readFile( path.resolve(route), 'utf8', function (err, data) {
		if (err) {return prom.next( err );}
		_addTemplate( data, prom );
	});
};


var _addFolder = function (folderPath, prom, self) {
	// get all files inside folderPath
	recursive( folderPath, function (error, files) {
		if (!files) { return prom.next();}
		var limit = files.length;
		if (error) { return prom.next( error );}
		if (!limit) { return prom.next();}

		var counter = newCounter( limit, prom );
		// read files
		files.forEach( function (filePath) {
			// exclude no .html files
			if (path.extname(filePath) !== '.html') {
				return counter();
			}
			fs.readFile( filePath, 'utf8', function (err, data) {
				if (err) { return counter( err );}
				self
				.addTemplate( data )
				.exec( function (err) {
					counter( err );
				});
			});
		});
	});
};


var _addTree = function (folderPath, prom) {
	folderPath = path.resolve( folderPath );
	var cutPath = folderPath.length + 1;

	// get all files inside folderPath
	recursive( folderPath, function (error, files) {
		var limit = files.length;
		if (error) { return prom.next( error );}
		if (!limit) { return prom.next();}

		var counter = newCounter( limit, prom );
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


var _addFilters = function (filts, prom) {
	var i;
	for (i in filts) {
		filters[i] = filts[i];
	}
	prom.next();
};

/*!
 * Nuts constructor
 */
var Nuts = function () {
	Prom.create( 'addTemplate', this, _addTemplate );
	Prom.create( 'addFile', this, _addFile );
	Prom.create( 'addFolder', this, _addFolder );
	Prom.create( 'addTree', this, _addTree );
	Prom.create( 'addFilters', this, _addFilters );
};


/**
 * Add template to templates archive
 * @param {String} source html with nut templates
 */
Nuts.prototype.addTemplate = function (source) {
	var promise = new Prom();
	promise.enqueue( function () {
		_addTemplate( source, promise );
	});
	return promise;
};

/**
 * Add a template from file
 * @param {String}   route template path
 * @param {Function} callback     Signature: error, addedTemplate
 */

Nuts.prototype.addFile = function (route) {
	var self = this;
	var promise = new Prom();
	promise.enqueue( function () {
		_addFile( route, promise, self );
	});
	return promise;
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
 * Add all templates in a folder
 * @param {String}   folderPath route to folder
 * @param {Function} callback   Signature: error
 */
Nuts.prototype.addFolder = function (folderPath) {
	var self = this;
	var promise = new Prom();
	promise.enqueue( function () {
		_addFolder( folderPath, promise, self );
	});
	return promise;
};

/**
 * Add all templates in a folder using its filename paths as template keynames
 * @param {String}   folderPath route to folder
 * @param {Function} callback   Signature: error
 */
Nuts.prototype.addTree = function (folderPath) {
	var self = this;
	var promise = new Prom();
	promise.enqueue( function () {
		_addTree( folderPath, promise, self );
	});
	return promise;
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


Nuts.prototype.addFilters = function (filter) {
	var promise = new Prom();
	promise.enqueue( function () {
		_addFilters( filter, promise);
	});
	return promise;
};


module.exports = new Nuts();
