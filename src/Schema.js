'use strict'

var nuProps = [
  'voidElement',
  'nutName',
  'type',
  'name',
  'data',
  'each',
  'class',
  'nuClass',
  'scope',
  'model',
  'repeat',
  'inherit',
  'nuif',
  'unless',
  'checked',
  'doctype',
  'children',
  'formats'
]

var nuObjs = [
  'attribs',
  'nuAtts'
]

var Schema = function (source, extension) {
  var i

  extension = Object.create(extension || null)
  delete extension.nutName

  nuProps.forEach(function (prop) {
    if (typeof source[prop] !== 'undefined') {
      extension[prop] = source[prop]
    }
  })

  nuObjs.forEach(function (o) {
    if (source[o]) {
      extension[o] = extension[o] || {}
      for (i in source[o]) {
        extension[o][i] = source[o][i]
      }
    }
  })

  if (source.nutName) {
    this.nutName = source.nutName
  }
  if (source.children) {
    extension.children = source.children
  }

  if (extension.children) {
    extension.children.forEach(function (child, i) {
      extension.finalChildren[i] = new Schema(child)
    })
  }

  for (i in extension) {
    this[i] = extension[i]
  }
}

module.exports = Schema
