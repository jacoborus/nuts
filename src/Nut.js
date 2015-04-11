'use strict';

// private dependencies
var Schema = require('./Schema.js'),
	compile = require('./compiler.js');

var Nut = function (dom, nuts) {
	this.nuts = nuts;
	this.schema = new Schema( dom );
	this.name = this.schema.nut;
	this.render = compile( this );
};


module.exports = Nut;
