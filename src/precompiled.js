'use strict'

const hasProp = function (name, list) {
  for (let i in list) {
    if (i === name) {
      return true
    }
  }
  return false
}

// move attributes with nu- prefix to nuAtts property
const getNamesakes = function (atts, nuAtts) {
  let ns = {
    names: {},
    sakes: {}
  }

  for (let i in atts) {
    if (hasProp(i, nuAtts)) {
      ns.names[i] = atts[i]
      ns.sakes[i] = nuAtts[i]
      delete atts[i]
      delete nuAtts[i]
    }
  }
  return ns
}

const getPrecompiled = function (schema, formatters) {
  let precompiled = {}
  for (let i in schema) {
    precompiled[i] = schema[i]
  }
  if (precompiled.attribs && precompiled.nuAtts) {
    let ns = getNamesakes(precompiled.attribs, precompiled.nuAtts)
    precompiled.nuSakes = ns.sakes
    precompiled.namesakes = ns.names
    if (Object.keys(precompiled.attribs).length === 0) {
      delete precompiled.attribs
    }
    if (Object.keys(precompiled.nuAtts).length === 0) {
      delete precompiled.nuAtts
    }
  }
  // add classlit to regular attributes when no nuClass
  if (precompiled.nuClass && !precompiled.class) {
    precompiled.nuAtts = precompiled.nuAtts || {}
    precompiled.nuAtts.class = precompiled.nuClass
    delete precompiled.nuClass
  }
  precompiled.start = '<' + precompiled.name
  if (precompiled.class && !precompiled.nuClass) {
    precompiled.start += ' class="' + precompiled.class + '"'
  }
  // set formatter methods
  if (precompiled.formatters) {
    precompiled.formatters = precompiled.formatters.map(name => formatters[name])
    // precompiled.formatters.forEach((format, i, arr) => {
    //   arr[i] = formatters[ format ]
    // })
  }
  return precompiled
}

module.exports = getPrecompiled
