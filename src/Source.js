'use strict';


// private dependencies
var voidElements = require('./void-elements.json');

/* - Utils */
// detect if an attribute name is prefixed with nu-
var startsWithNu = function (str) {
    return str.indexOf( 'nu-' ) === 0;
};
// remove nu- prefix from attribute
var getNuProp = function (prop) {
    return prop.substr(3, prop.length);
};


// move attributes with nu- prefix to nuAtts property
var getNuAtts = function (atts) {
	var nuAtts = {},
		c = 0,
		i;
	for (i in atts) {
		if (startsWithNu( i )) {
			nuAtts[ getNuProp( i )] = atts[i];
			delete atts[i];
			++c;
		}
	}
	if (c > 0) {
		return nuAtts;
	}
	return false;
};

var getBooleans = function (attribs) {
	var bools = {},
		pattern = /-$/g,
		i;
	for (i in attribs) {
    	if (i.match( pattern )) {
    		bools[ i.replace( pattern, '' )] = attribs[i];
    		delete attribs[i];
    	}
	}
	return bools;
};



/*!
 * nuts schema constructor
 * Get nuts formatted dom object info from parsed html
 * @param {Object} dom    parsed HTML
 * @param {Object} parent [description]
 */
var Schema = function (dom) {
	var atts = dom.attribs,
		self = this;
	this.type = dom.type;
	this.data = dom.data;
	this.name = dom.name;
	this.voidElement = voidElements[ this.name ] || false;
	// assign attributes
	if (atts) {
		// separate special attributes
		if (atts.class) {
			this.class = atts.class;
			delete atts.class;
		}
		if (atts['nu-class']) {
			this.nuClass = atts['nu-class'];
			delete atts['nu-class'];
		}
		if (atts.nut) {
			this.nutName = atts.nut;
			delete atts.nut;
		}
		// scope
		if (atts['nu-scope']) {
			this.scope = atts['nu-scope'];
			delete atts['nu-scope'];
		}
		if (typeof atts['nu-model'] !== 'undefined') {
			this.model = atts['nu-model'];
			delete atts['nu-model'];
		}
		if (typeof atts['nu-inherit'] !== 'undefined') {
			this.inherit = atts['nu-inherit'];
			delete atts['nu-inherit'];
		}
		// iterations
		if (typeof atts['nu-repeat'] !== 'undefined') {
			this.repeat = atts['nu-repeat'];
			delete atts['nu-repeat'];
		}
		if (typeof atts['nu-each'] !== 'undefined') {
			this.each = atts['nu-each'];
			delete atts['nu-each'];
		}
		// conditionals
		if (typeof atts['nu-if'] !== 'undefined') {
			if (atts['nu-if']) {
				this.nuif = atts['nu-if'];
			}
			delete atts['nu-if'];
		}
		if (typeof atts['nu-unless'] !== 'undefined') {
			if (atts['nu-unless']) {
				this.unless = atts['nu-unless'];
			}
			delete atts['nu-unless'];
		}
		// layouts and extensions
		if (typeof atts['nu-block'] !== 'undefined') {
			this.block = atts['nu-block'];
			delete atts['nu-block'];
		}
		if (typeof atts['nu-layout'] !== 'undefined') {
			this.layout = atts['nu-layout'];
			delete atts['nu-layout'];
		}
		if (typeof atts['nu-extend'] !== 'undefined') {
			this.extend = atts['nu-extend'];
			delete atts['nu-extend'];
		}
		if (typeof atts['nu-as'] !== 'undefined') {
			if (atts['nu-as']) {
				this.as = atts['nu-as'];
			}
			delete atts['nu-as'];
		}

		// doctypes
		if (typeof atts['nu-doctype'] !== 'undefined') {
			// HTML5
			if (atts['nu-doctype'] === '' || atts['nu-doctype'] === '5') {
				this.doctype = '5';
			}
			// HTML4
			if (atts['nu-doctype'] === '4' || atts['nu-doctype'] === '4s') {
				this.doctype = '4s';
			}
			if (atts['nu-doctype'] === '4t') {
				this.doctype = '4t';
			}
			if (atts['nu-doctype'] === '4f') {
				this.doctype = '4f';
			}
			// XHTML1.0
			if (atts['nu-doctype'] === 'x' || atts['nu-doctype'] === 'xs') {
				this.doctype = 'xs';
			}
			if (atts['nu-doctype'] === 'xt') {
				this.doctype = 'xt';
			}
			if (atts['nu-doctype'] === 'xf') {
				this.doctype = 'xf';
			}
			// XHTML1.1
			if (atts['nu-doctype'] === 'xx' || atts['nu-doctype'] === '11') {
				this.doctype = 'xx';
			}
			delete atts['nu-doctype'];
		} else {
			this.doctype = false;
		}

		// separate nuAttributes from the regular ones
		this.nuAtts = getNuAtts( atts );

		this.booleans = getBooleans( this.nuAtts );
	}

	// assign attributes
	if (atts && Object.keys( atts ).length) {
		this.attribs = atts;
	}
};


module.exports = Schema;
