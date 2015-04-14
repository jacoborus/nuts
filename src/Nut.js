'use strict';

// private dependencies
var Schema = require('./Schema.js'),
	getCompiler = require('./get-compiler.js');

var Nut = function (dom, nuts) {
	var self = this;
	this.nuts = nuts;
	this.schema = new Schema( dom, nuts );
	this.name = this.schema.nut;
	this.compile = getCompiler( this.schema );
	if (this.schema.children) {
		this.children = [];
		this.schema.children.forEach( function (child) {
			self.children.push( new Nut( child ));
		});
	}
	this.render = false;
};

module.exports = Nut;
