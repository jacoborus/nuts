'use strict';

var fs = require('fs'),
	path = require('path'),
	recursive = require('recursive-readdir'),
	htmlparser = require('htmlparser2');

var archive = {},
	allCompiled = false;




/* - Generate compiled tags - */

var newCompiledText = function (tmp) {
	var out = tmp.data;
	return function () {
		return out;
	};
};

var newCompiledComment = function (tmp) {
	var out = '<!--' + tmp.data + '-->';
	return function () {
		return out;
	};
};

var newCompiledDirective = function (tmp) {
	var out;
	if (tmp.name === '!doctype') {
		out = '<!DOCTYPE html>';
	} else {
		out = '<' + tmp.name + '>';
	}
	return function () {
		return out;
	};
};

var newCompiledTag = function (tmp) {
	var i;

	// open and close tag strings
	var preTag = '<' + tmp.name,
		postTag = '</' + tmp.name +'>',
		classAtt = 'class="',
		atts = tmp.attribs;

	// render regular attributes
	if (tmp.class) {
		preTag += ' ' + classAtt + tmp.class + '"';
	}
	for (i in atts) {
		preTag += ' ' + i + '="' + atts[i] + '"';
	}
	preTag += '>';

	var	children = tmp.children;
	for (i in children) {
		children[i].render = compile( children[i] );
	}

	return function (x) {
		var out = preTag;

		if (tmp.scope) {
			if (x[tmp.scope]) {
				x = x[tmp.scope];
			} else {
				x = {};
			}
		}

		// compile content
		if (tmp.model && x[tmp.model]) {
			out += x[tmp.model];
		} else {
			for (i in children) {
				out += children[i].render( x );
			}
		}

		// close tag
		out += postTag;
		return out;
	};
};

/*!
 * get a compiled template
 * @param  {Object} template template model
 * @return {Function}          compiled template
 */
var compile = function (template) {
	var schema = template.schema;
	switch (schema.type) {
		case 'tag':
			return newCompiledTag( schema );
		case 'text':
			return newCompiledText( schema );
		case 'comment':
			return newCompiledComment( schema );
		case 'directive':
			return newCompiledDirective( schema );
	}
};





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


/*!
 * nuts schema constructor
 * Get nuts formatted dom object info from parsed html
 * @param {Object} dom    parsed HTML
 * @param {Object} parent [description]
 */
var NuSchema = function (dom) {
	var atts = dom.attribs,
		domChildren, nuChildren, i;

	this.type = dom.type;
	this.data = dom.data;
	this.name = dom.name;

	// assign attributes
	if (atts) {
		this.atts = {};
		// separate special attributes
		if (atts.class) {
			this.class = atts.class;
			delete atts.class;
		}
		if (atts['nu-class']) {
			this.nuClass = atts['nu-class'];
			delete atts['nu-class'];
		}
		if (atts['nu-scope']) {
			this.scope = atts['nu-scope'];
			delete atts['nu-scope'];
		}
		if (atts['nu-model'] || atts['nu-model'] === '') {
			this.model = atts['nu-model'];
			delete atts['nu-model'];
		}
		if (atts['nu-repeat'] || atts['nu-repeat'] === '') {
			this.repeat = atts['nu-repeat'];
			delete atts['nu-repeat'];
		}
		if (atts['nu-key'] || atts['nu-key'] === '') {
			this.key = '';
			delete atts['nu-key'];
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

	// assign attributes
	this.attribs = atts || {};
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
