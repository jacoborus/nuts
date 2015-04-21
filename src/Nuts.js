'use strict';

var Nut = require('./Nut.js'),
	parser = require('./parser.js'),
	recursive = require('recursive-readdir'),
	fs = require('fs'),
	path = require('path'),
	newCounter = require('./loop.js').newCounter,
	sequence = require('./loop.js').sequence;


var compile = function (next) {
	var keys = Object.keys( this.items ),
	len = keys.length,
	i;

	if (!len) {
		return next();
	}

	for (i in this.items) {
		this.items[i].schema = this.items[i].getSchema( );
	}

	for (i in this.items) {
		this.items[i].precompiled = this.items[i].getPrecompiled( );
	}

	for (i in this.items) {
		this.items[i].render = this.items[i].getRender( );
	}
	this.compiled = true;
	next();
};



// nuts constructor
var Nuts = function () {
	this.compiled = false;
	this.Nuts = Nuts;
	this.items = {};
	this.formats = {};
	this.filters = {};
	this.promises = [];
	this.errors = [];
};

/**
 * Add a new promise in the stack
 * @param  {Function} fn method
 * @return {Object}      nuts
 */
Nuts.prototype.then = function (fn) {
	if (typeof fn !== 'function') {
		this.errors.push( 'nuts.then requires a function as param' );
		return this;
	}
	this.promises.push( fn );
	return this;
};



Nuts.prototype.exec = function (callback) {
	callback = callback || function () {};
	var fns = this.promises.slice();
	this.promises = [];
	sequence( this, fns, callback );
};


Nuts.prototype.getNut = function (keyname) {
	return this.items[keyname];
};


/*!
 * Add templates to archive
 * @param {String}   html text with nuts
 * @param {Function} next launch next function in the stack
 */
var addNuts = function (html, next) {
	var self = this;
	this.compiled = false;

	parser( html, function (err, parsed) {
		if (err) {
			return self.errors.push( err );
		}
		if (!parsed.length) {
			return next();
		}
		var count = newCounter( parsed.length, next );
		parsed.forEach( function (parsedNut) {
			if (parsedNut.type === 'text' && parsedNut.data.trim() === '') {
				return count();
			}
			var nut = new Nut( parsedNut, self );
			if (!nut.nutName) {
				return next( 'Nuts templates requires nut attribute' );
			}
			self.items[ nut.nutName ] = nut;
			count();
		});
	});

	return this;
};

Nuts.prototype.addNuts = function (html) {
	var self = this;
	this.promises.push( function (next) {
		addNuts.call( self, html, next );
	});
	return this;
};

Nuts.prototype.setTemplate = function (keyname, tmpl) {
	var self = this;
	this.compiled = false;
	this.promises.push( function (next) {
		parser( tmpl, function (err, parsed) {
			var nut = new Nut( parsed[0], self );
			nut.name = keyname;
			self.items[ keyname ] = nut;
			next();
		});
	});
	return this;
};

Nuts.prototype.setTemplates = function (tmpls) {
	var i;
	for (i in tmpls) {
		this.setTemplate( i, tmpls[i] );
	}
	return this;
};

Nuts.prototype.addFile = function (filePath) {
	var self = this;
	self.addNuts( fs.readFileSync( filePath, { encoding: 'utf8' }));
	return this;
};

Nuts.prototype.addFolder = function (folderPath) {
	var self = this;
	this.compiled = false;
	this.promises.push( function (next) {
		// get all files inside folderPath
		recursive( folderPath, function (error, files) {
			if (!files) { return next();}
			if (error) { return next( error );}
			var limit = files.length;
			if (!limit) { return next();}

			var count = newCounter( limit, next );
			// read files
			files.forEach( function (filePath) {
				// exclude no .html files
				if (path.extname(filePath) !== '.html') {
					return count();
				}
				addNuts.call( self, fs.readFileSync( filePath, { encoding: 'utf8' }), count );
			});
		});
	});
	return this;
};

Nuts.prototype.addFormat = function (keyname, formatter) {
	var self = this;
	this.compiled = false;
	this.promises.push( function (next) {
		self.formats[keyname] = formatter;
		next();
	});
	return this;
};

Nuts.prototype.addFilter = function (keyname, filter) {
	var self = this;
	this.compiled = false;
	this.promises.push( function (next) {
		self.filters[keyname] = filter;
		next();
	});
	return this;
};

Nuts.prototype.render = function (keyname, data, callback) {
	if (!this.compiled) {
		callback( 'compile before render please' );
	}
	var nut = this.items[ keyname ];
	if (nut) {
		return nut.render( data, function (out) {
			callback( null, out );
		});
	}
	callback( null, '' );
};


Nuts.prototype.compile = function (callback) {
	callback = callback || function () {};
	this.promises.push( compile );
	var fns = this.promises.slice();
	this.promises = [];
	sequence( this, fns, callback );
};



Nuts.prototype.get = function (keyname) {
	return this.items[ keyname ];
};

module.exports = Nuts;
