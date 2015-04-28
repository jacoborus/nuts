'use strict';

var hasProp = function (name, list) {
	var i;
	for (i in list) {
		if (i === name) {
			return true;
		}
	}
	return false;
};

// move attributes with nu- prefix to nuAtts property
var getNamesakes = function (atts, nuAtts) {
	var ns = {
		names : {},
		sakes : {}
	}, i;

	for (i in atts) {
		if (hasProp( i, nuAtts )) {
			ns.names[i] = atts[i];
			ns.sakes[i] = nuAtts[i];
			delete atts[i];
			delete nuAtts[i];
		}
	}
	return ns;
};

var Precompiled = function (schema, formats) {
	var i;
	for (i in schema) {
		this[i] = schema[i];
	}
	if (this.attribs && this.nuAtts) {
		var ns = getNamesakes( this.attribs, this.nuAtts );
		this.nuSakes = ns.sakes;
		this.namesakes = ns.names;
		if (Object.keys( this.attribs ).length === 0) {
			delete this.attribs;
		}
		if (Object.keys( this.nuAtts ).length === 0) {
			delete this.nuAtts;
		}
	}
	// add classlit to regular attributes when no nuClass
	if (this.nuClass && !this.class) {
		this.nuAtts = this.nuAtts || {};
		this.nuAtts.class = this.nuClass;
		delete this.nuClass;
	}
	this.start = '<' + this.name;
	if (this.class && !this.nuClass) {
		this.start += ' class="' + this.class + '"';
	}
	// set formatter methods
	if (this.formats) {
		this.formats.forEach( function (format, i, arr) {
			arr[i] = formats[ format ];
		});
	}
};

module.exports = Precompiled;
