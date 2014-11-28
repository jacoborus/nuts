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
		domChildren, nuChildren, i;

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
		if (atts['nu-pipe'] || atts['nu-pipe'] === '') {
			this.pipe = atts['nu-pipe'];
			delete atts['nu-pipe'];
		}
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
		if (atts['nu-checked'] || atts['nu-checked'] === '') {
			this.checked = atts['nu-checked'];
			delete atts['nu-checked'];
		}
		if (atts['nu-doctype'] === '') {
			this.doctype = true;
			delete atts['nu-doctype'];
		}
		if (atts['nu-is'] || atts['nu-is'] === '') {
			if (atts['nu-is']) {
				this.is = atts['nu-is'];
			}
			delete atts['nu-is'];
		}

		// separate nuAttributes from the regular ones
		separateNuAtts.call( dom );
		separateNamesakes.call( dom );
	}

	// assign children dom elements
	if (dom.children) {
		this.children = [];
		nuChildren = this.children;
		domChildren = dom.children;
		for (i in domChildren) {
			nuChildren[i] = {
				src : null,
				schema: new Schema( domChildren[i] )
			};
		}
	}

	// assign attributes
	this.attribs = atts || {};
	this.nuAtts = dom.nuAtts || {};
	this.namesakes = dom.namesakes || {};
	this.nuSakes = dom.nuSakes || {};
};

module.exports = Schema;
