'use strict'

// create a Set with all self-closing html tags
const voidElements = require('./void-elements.json'),
      voidElementsSet = new Set

voidElements.forEach(e => voidElementsSet.add(e))

/* - Utils */
// detect if an attribute name is prefixed with nu-
const startsWithNu = str => str.startsWith('nu-')

// remove nu- prefix from attribute
const getNuProp = prop => prop.substr(3, prop.length)

// move attributes with nu- prefix to nuAtts property
const extractNuAtts = function (atts) {
  let nuAtts = {},
      c = 0

  for (let i in atts) {
    if (startsWithNu(i)) {
      nuAtts[getNuProp(i)] = atts[i]
      delete atts[i]
      c++
    }
  }
  if (c > 0) {
    return nuAtts
  }
  return false
}

// return a object with all boolean attributes
// and remove them from regular ones
const extractBooleans = function (attribs) {
  let bools = {}

  for (let i in attribs) {
    if (i.endsWith('-')) {
      bools[i.slice(0, -1)] = attribs[i]
      delete attribs[i]
    }
  }
  return bools
}

const getFormats = function (source) {
  let formats = []
  // skip operation if tag has no model
  if (typeof source.model === 'undefined') {
    return false
  }
  formats = source.model.split('|')
  if (formats.length === 1) {
    return false
  }
  source.model = formats.shift().trim()
  formats.forEach((format, i) => formats[i] = format.trim())
  return formats
}

/*!
 * nuts schema constructor
 * Get nuts formatted dom object info from parsed html
 * @param {Object} dom    parsed HTML
 * @param {Object} parent [description]
 */
const getSource = function (dom) {
  let src = {},
      atts = dom.attribs

  src.type = dom.type
  src.data = dom.data
  src.name = dom.name
  src.voidElement = voidElementsSet.has(src.name)
  // assign attributes
  if (atts) {
    // separate special attributes
    if (atts.class) {
      src.class = atts.class
      delete atts.class
    }
    if (atts['nu-class']) {
      src.nuClass = atts['nu-class']
      delete atts['nu-class']
    }
    if (atts.nut) {
      src.nutName = atts.nut
      delete atts.nut
    }
    // scope
    if (atts['nu-scope']) {
      src.scope = atts['nu-scope']
      delete atts['nu-scope']
    }
    if (atts['nu-model'] !== undefined) {
      src.model = atts['nu-model']
      delete atts['nu-model']
    }
    if (atts['nu-inherit'] !== undefined) {
      src.inherit = atts['nu-inherit']
      delete atts['nu-inherit']
    }
    // iterations
    if (atts['nu-repeat'] !== undefined) {
      src.repeat = atts['nu-repeat']
      delete atts['nu-repeat']
    }
    if (atts['nu-each'] !== undefined) {
      src.each = atts['nu-each']
      delete atts['nu-each']
    }
    // conditionals
    if (atts['nu-if'] !== undefined) {
      if (atts['nu-if']) {
        src.nuif = atts['nu-if']
      }
      delete atts['nu-if']
    }
    if (atts['nu-unless'] !== undefined) {
      if (atts['nu-unless']) {
        src.unless = atts['nu-unless']
      }
      delete atts['nu-unless']
    }
    // layouts and extensions
    if (atts['nu-block'] !== undefined) {
      src.block = atts['nu-block']
      delete atts['nu-block']
    }
    if (atts['nu-layout'] !== undefined) {
      src.layout = atts['nu-layout']
      delete atts['nu-layout']
    }
    if (atts['nu-extend'] !== undefined) {
      src.extend = atts['nu-extend']
      delete atts['nu-extend']
    }
    if (atts['nu-as'] !== undefined) {
      if (atts['nu-as']) {
        src.as = atts['nu-as']
      }
      delete atts['nu-as']
    }

    // doctypes
    if (atts['nu-doctype'] !== undefined) {
      // HTML5
      if (atts['nu-doctype'] === '' || atts['nu-doctype'] === '5') {
        src.doctype = '5'
      }
      // HTML4
      if (atts['nu-doctype'] === '4' || atts['nu-doctype'] === '4s') {
        src.doctype = '4s'
      }
      if (atts['nu-doctype'] === '4t') {
        src.doctype = '4t'
      }
      if (atts['nu-doctype'] === '4f') {
        src.doctype = '4f'
      }
      // XHTML1.0
      if (atts['nu-doctype'] === 'x' || atts['nu-doctype'] === 'xs') {
        src.doctype = 'xs'
      }
      if (atts['nu-doctype'] === 'xt') {
        src.doctype = 'xt'
      }
      if (atts['nu-doctype'] === 'xf') {
        src.doctype = 'xf'
      }
      // XHTML1.1
      if (atts['nu-doctype'] === 'xx' || atts['nu-doctype'] === '11') {
        src.doctype = 'xx'
      }
      delete atts['nu-doctype']
    } else {
      src.doctype = false
    }

    // separate nut specific attributes from the regular ones
    src.nuAtts = extractNuAtts(atts)
    // separate boolean attributes from the regular ones
    src.booleans = extractBooleans(src.nuAtts)
  }

  let formats = getFormats(src)
  if (formats) {
    src.formats = formats
  }

  // assign attributes
  if (atts && Object.keys(atts).length) {
    src.attribs = atts
  }
  return src
}

module.exports = getSource
