'use strict';

var fs = require('fs'),
	path = require('path'),
	recursive = require('recursive-readdir'),
	htmlparser = require('htmlparser2');

var archive = {},
	allCompiled = false;


// detect if an attribute name is prefixed with nu-
var startsWithNu = function (str) {
    return str.indexOf( 'nu-' ) === 0;
};
// remove nu- prefix from attribute
var getNuProp = function (prop) {
    return prop.substr(3, prop.length);
};
// move attributes with nu- prefix to nuAtts property
var separateNuAtts = function () {
	var nuAtts = {},
		atts = this.attribs,
		i;

	for (i in atts) {
		if (startsWithNu( i )) {
			nuAtts[ getNuProp( i )] = atts[i];
			delete atts[i];
		}
	}
	this.nuAtts = nuAtts;
};

// get nuts formatted dom object info from parsed html
var NuSchema = function (dom, parent) {
	var domAtts = dom.attribs,
		domChildren, nuChildren, i;

	this.parent = parent || null;
	this.type = dom.type;
	this.data = dom.data;
	this.name = dom.name;
	this.nuAtts = {};

	// assign attributes
	if (domAtts) {
		this.atts = {};
		// separate special attributes
		// class
		if (domAtts.class) {
			this.class = domAtts.class;
			delete domAtts.class;
		}
		// nuClass
		if (domAtts['nu-class']) {
			this.nuClass = domAtts['nu-class'];
			delete domAtts['nu-class'];
		}
		// scope
		if (domAtts['nu-scope']) {
			this.scope = domAtts['nu-scope'];
			delete domAtts['nu-scope'];
		}
		// model
		if (domAtts['nu-model']) {
			this.model = domAtts['nu-model'];
			delete domAtts['nu-model'];
		}
		if (domAtts['nu-model'] === '') {
			this.model = '';
			delete domAtts['nu-model'];
		}
		// repeat
		if (domAtts['nu-repeat'] === '') {
			this.repeat = '';
			delete domAtts['nu-repeat'];
		} else if (domAtts['nu-repeat']) {
			this.repeat = domAtts['nu-repeat'];
			delete domAtts['nu-repeat'];
		}
		// key
		if (domAtts['nu-key'] || domAtts['nu-key'] === '') {
			this.key = '';
			delete domAtts['nu-key'];
		}

		// separate nuAttributes from the regular ones
		separateNuAtts.call( dom );
	}

	// assign children dom elements
	if (dom.children) {
		this.children = [];
		nuChildren = this.children;
		domChildren = dom.children;
		for (i in domChildren) {
			nuChildren[i] = {
				src : null,
				schema: new NuSchema( domChildren[i] )
			};
		}
	}
	this.attribs = dom.attribs || {};
	this.nuAtts = dom.nuAtts || {};
};



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
			schema: new NuSchema( dom[0] )
		});
	}, {
		normalizeWhitespace: true
	});
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


module.exports = new Nuts();
