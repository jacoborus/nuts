'use strict';

var Nut = require('./Nut.js'),
	parser = require('./parser.js'),
	recursive = require('recursive-readdir'),
	fs = require('fs'),
	path = require('path');


var serie = function (target, fns, callback) {
	callback = callback || function (err) {
		if (err) { throw err;}
	};
	if (target.errors.length) {
		return callback( new Error( target.errors[0] ));
	}
	var next = function (err) {
		if (err) { return callback( err );}
		if (!fns.length) {
			return callback();
		}
		fns.shift().call( target, next );
	};
	next();
};

var newCounter = function (limit, callback) {
	var count = 0;
	return function (err) {
		if (err) { return callback( err );}
		if (++count === limit) {
			callback();
		}
	};
};


// nuts constructor
var Nuts = function () {
	this.Nuts = Nuts;
	this.items = {};
	this.formats = {};
	this.filters = {};
	this.promises = [];
	this.errors = [];
};

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
	serie( this, fns, callback );
};

Nuts.prototype.getNut = function (keyname) {
	return this.items[keyname];
};

var addNuts = function (html, next) {
	var self = this;

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
			if (!nut.name) {
				return next( 'Nuts templates requires nut attribute' );
			}
			self.items[ nut.name ] = nut;
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
	this.promises.push( function (next) {
		self.formats[keyname] = formatter;
		next();
	});
	return this;
};

Nuts.prototype.addFilter = function (keyname, filter) {
	var self = this;
	this.promises.push( function (next) {
		self.filters[keyname] = filter;
		next();
	});
	return this;
};


module.exports = Nuts;
