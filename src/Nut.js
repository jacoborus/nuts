'use strict'

// private dependencies
const getSource = require('./source.js'),
      getSchema = require('./schema.js'),
      getPrecompiled = require('./precompiled.js'),
      Compiled = require('./compiler.js')

/*!
 * random hash generator
 * @return {string} random hash
 */
const uniid = function () {
  let s4 = function () {
    return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1)
  }
  return s4() + s4() + '-' + s4()
}

// NUT Constructor
class Nut {
  constructor (dom, nuts) {
    let partials = [],
        children

    this.nuts = nuts
    this.source = getSource(dom)
    if (this.source.nutName) {
      this.nutName = this.source.nutName
    }

    // assign children dom elements
    if (dom.children && dom.children.length) {
      // create children container in schema
      this.children = children = []
      dom.children.forEach(function (child) {
        // avoid empty text tags
        if (child.type !== 'text' || child.data.trim() !== '') {
          // add child
          children.push(new Nut(child, nuts))
        }
      })
      // add children partials to nut.partials
      this.children.forEach(function (child) {
        // TODO: rethink this
        if (child.partials) {
          child.partials.forEach(function (partial) {
            partials.push(partial)
          })
        }
        if (child.partial) {
          partials.push(child.partial)
        }
      })
      if (partials.length) {
        this.partials = partials
      }
    }

    if (this.source.as) {
      this.partial = this.source.as
    }
    this.type = this.source.type
    this.nuts.templates[ this.nutName || uniid()] = this
  }

  getSchema () {
    let partial
    if (this.partial) {
      partial = this.nuts.items[ this.partial ]
      if (partial.children) {
        partial.children.forEach(function (nut) {
          nut.schema = nut.getSchema()
        })
        this.finalChildren = partial.children
      } else {
        // TODO: is this working?
        this.finalChildren = this.children
      }
      return getSchema(this.source, this.nuts.items[ this.partial ].schema)
    }
    if (this.children) {
      this.children.forEach(function (nut) {
        nut.schema = nut.getSchema()
      })
      this.finalChildren = this.children
    }
    return getSchema(this.source)
  }

  getPrecompiled () {
    if (this.finalChildren) {
      this.finalChildren.forEach(function (nut) {
        nut.precompiled = nut.getPrecompiled()
      })
    }
    return getPrecompiled(this.schema, this.nuts.formatters)
  }

  /**
   * Compiles the tag and return the compiled function
   *
   * @return {object} compiled tag
   */
  getRender () {
    if (this.finalChildren) {
      this.finalChildren.forEach(function (nut) {
        nut.renders = nut.getRender()
      })
    }
    return new Compiled(this.precompiled, this.finalChildren, this.nuts.filters)
  }

  readyForSchema () {
    let templates = this.nuts.templates,
        partials = this.partials

    // check if a template has partial and its schema ready
    if (this.partial && !templates[ this.partial ].schema) {
      return true
    }

    // check if any partial of the tag has not its schema ready
    return partials ? !partials.some(partial => !templates[partial].schema) : true
  }
}

module.exports = Nut
