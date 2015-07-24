'use strict'

// private dependencies
var Source = require('./Source.js'),
    Schema = require('./Schema.js'),
    Precompiled = require('./Precompiled.js'),
    Compiled = require('./compiler.js')

// ramdom hash generator
var uniid = function () {
  var s4 = function () {
    return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1)
  }
  return s4() + s4() + '-' + s4()
}

// NUT Constructor
var Nut = function (dom, nuts) {
  var partials = [],
      children

  this.nuts = nuts
  this.source = new Source(dom)
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
    // remove children container if empty
    if (!this.children.length) {
      delete this.children
    } else {
      // add children partials to nut.partials
      this.children.forEach(function (child) {
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
  }

  if (this.source.as) {
    this.partial = this.source.as
  }
  this.type = this.source.type
  this.nuts.templates[ this.nutName || uniid()] = this
}

Nut.prototype.getSchema = function () {
  var partial
  if (this.partial) {
    partial = this.nuts.items[ this.partial ]
    if (partial.children) {
      partial.children.forEach(function (nut) {
        nut.schema = nut.getSchema()
      })
      this.finalChildren = partial.children
    } else {
      this.finalChildren = this.children
    }
    return new Schema(this.source, this.nuts.items[ this.partial ].schema)
  }
  if (this.children) {
    this.children.forEach(function (nut) {
      nut.schema = nut.getSchema()
    })
    this.finalChildren = this.children
  }
  return new Schema(this.source)
}

Nut.prototype.getPrecompiled = function () {
  if (this.finalChildren) {
    this.finalChildren.forEach(function (nut) {
      nut.precompiled = nut.getPrecompiled()
    })
  }
  return new Precompiled(this.schema, this.nuts.formats)
}

Nut.prototype.getRender = function () {
  if (this.finalChildren) {
    this.finalChildren.forEach(function (nut) {
      nut.renders = nut.getRender()
    })
  }
  return new Compiled(this.precompiled, this.finalChildren, this.nuts.filters)
}

module.exports = Nut
