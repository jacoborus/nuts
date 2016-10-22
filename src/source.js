'use strict'

// create a Set with all self-closing html tags
const voidElements = require('./void-elements.json')
const voidElementsSet = new Set()

voidElements.forEach(e => voidElementsSet.add(e))

/*!
 * nuts schema constructor
 * Get nuts formatted dom object info from parsed html
 * @param {Object} dom    parsed HTML
 * @param {Object} parent [description]
 */
const getSource = function (dom) {
  let src = {}
  let atts = dom.attribs

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

    // move attributes with nu- prefix to nuAtts property
    src.nuAtts = {}
    for (let i in atts) {
      // detect if an attribute name is prefixed with nu-
      if (i.startsWith('nu-')) {
        // add nut specific attribute to nuAtts (without nu- prefix)
        src.nuAtts[i.substr(3, i.length)] = atts[i]
        delete atts[i]
      }
    }

    // separate boolean attributes from the regular ones
    // and remove them from regular ones
    src.booleans = {}
    for (let i in src.nuAtts) {
      if (i.endsWith('-')) {
        src.booleans[i.slice(0, -1)] = src.nuAtts[i]
        delete src.nuAtts[i]
      }
    }
  }

  {
    // add formatters from piped model
    let formatters = []
    // skip operation if tag has no model
    if (typeof src.model !== 'undefined') {
      formatters = src.model.split('|')
      // skip if tag has not formatters
      if (formatters.length !== 1) {
        // extract model from formatters
        src.model = formatters.shift().trim()
        // remove extra spaces form formatter names
        formatters.forEach((format, i) => { formatters[i] = format.trim() })
        // add formatters to source
        if (formatters) {
          src.formatters = formatters
        }
      }
    }
  }

  // assign attributes
  if (atts && Object.keys(atts).length) {
    src.attribs = atts
  }
  return src
}

module.exports = getSource
