'use strict';

/* - Utils */
// detect if an attribute name is prefixed with nu-
var startsWithNu = function (str) {
    return str.indexOf( 'nu-' ) === 0;
};
// remove nu- prefix from attribute
var getNuProp = function (prop) {
    return prop.substr(3, prop.length);
};

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
var separateNamesakes = function () {
	var names = {},
		sakes = {},
		atts = this.attribs,
		i;

	for (i in atts) {
		if (hasProp( i, this.nuAtts )) {
			names[i] = atts[i];
			sakes[i] = this.nuAtts[i];
			delete atts[i];
			delete this.nuAtts[i];
		}
	}
	this.namesakes = names;
	this.nuSakes = sakes;
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
var Schema = function (dom) {
	var atts = dom.attribs,
		self = this;

	this.type = dom.type;
	this.data = dom.data;
	this.name = dom.name;

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
			this.nut = atts.nut;
			delete atts.nut;
		}
		// scope
		if (atts['nu-scope']) {
			this.scope = atts['nu-scope'];
			delete atts['nu-scope'];
		}
		if (atts['nu-model'] || atts['nu-model'] === '') {
			this.model = atts['nu-model'];
			delete atts['nu-model'];
		}
		if (atts['nu-inherit'] || atts['nu-inherit'] === '') {
			this.inherit = atts['nu-inherit'];
			delete atts['nu-inherit'];
		}
		// iterations
		if (atts['nu-repeat'] || atts['nu-repeat'] === '') {
			this.repeat = atts['nu-repeat'];
			delete atts['nu-repeat'];
		}
		if (atts['nu-each'] || atts['nu-each'] === '') {
			this.each = atts['nu-each'];
			delete atts['nu-each'];
		}
		// conditionals
		if (atts['nu-if'] || atts['nu-if'] === '') {
			if (atts['nu-if']) {
				this.nuif = atts['nu-if'];
			}
			delete atts['nu-if'];
		}
		if (atts['nu-unless'] || atts['nu-unless'] === '') {
			if (atts['nu-unless']) {
				this.unless = atts['nu-unless'];
			}
			delete atts['nu-unless'];
		}
		// layouts and extensions
		if (atts['nu-block'] || atts['nu-block'] === '') {
			this.block = atts['nu-block'];
			delete atts['nu-block'];
		}
		if (atts['nu-layout'] || atts['nu-layout'] === '') {
			this.layout = atts['nu-layout'];
			delete atts['nu-layout'];
		}
		if (atts['nu-extend'] || atts['nu-extend'] === '') {
			this.extend = atts['nu-extend'];
			delete atts['nu-extend'];
		}
		if (atts['nu-as'] || atts['nu-as'] === '') {
			if (atts['nu-as']) {
				this.as = atts['nu-as'];
			}
			delete atts['nu-as'];
		}

		// doctypes
		if (atts['nu-doctype'] || atts['nu-doctype'] === '') {
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
		separateNuAtts.call( dom );
		separateNamesakes.call( dom );
	}

	// assign children dom elements
	if (dom.children && dom.children.length) {
		// create children container in schema
		this.children = [];
		dom.children.forEach( function (child) {
			// avoid empty text tags
			if (child.type !== 'text' && child.data.trim() !== '') {
				// add child
				self.children.push({
					schema: new Schema( child )
				});
			}
		});
		// remove children container if empty
		if (!this.children.length) {
			delete this.children;
		}
	}

	// assign attributes
	this.attribs = atts || {};
	this.nuAtts = dom.nuAtts || {};
	this.namesakes = dom.namesakes || {};
	this.nuSakes = dom.nuSakes || {};
};

module.exports = Schema;