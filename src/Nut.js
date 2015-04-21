'use strict';


// private dependencies
var Source = require('./Source.js'),
	Schema = require('./Schema.js'),
	Precompiled = require('./Precompiled.js'),
	Compiled = require('./compiler.js');


var Nut = function (dom, nuts) {
	var children;
	this.nuts = nuts;
	this.source = new Source( dom );
	if (this.source.nutName) {
		this.nutName = this.source.nutName;
	}
	// assign children dom elements
	if (dom.children && dom.children.length) {
		// create children container in schema
		this.children = children = [];
		dom.children.forEach( function (child) {
			// avoid empty text tags
			if (child.type !== 'text' || child.data.trim() !== '') {
				// add child
				children.push( new Nut( child, nuts ));
			}
		});
		// remove children container if empty
		if (!this.children.length) {
			delete this.children;
		}
	}

	if (this.source.as) {
		this.partial = this.source.as;
	}

	this.type = this.source.type;
};

Nut.prototype.getSchema = function () {
	if (this.children) {
		this.children.forEach( function (nut) {
			nut.schema = nut.getSchema();
		});
	}
	return new Schema( this.source );
};

Nut.prototype.getPrecompiled = function () {
	if (this.children) {
		this.children.forEach( function (nut) {
			nut.precompiled = nut.getPrecompiled();
		});
	}
	return new Precompiled( this.schema );
};


Nut.prototype.getRender = function () {
	if (this.children) {
		this.children.forEach( function (nut) {
			nut.renders = nut.getRender();
		});
	}
	return new Compiled( this.precompiled, this.children );
};

module.exports = Nut;
