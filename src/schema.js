'use strict'

const nuProps = [
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

const nuObjs = [
  'attribs',
  'nuAtts'
]

const getSchema = function (source, extension) {
  let schema = {}
  extension = Object.create(extension || null)
  delete extension.nutName

  nuProps.forEach(prop => {
    if (source[prop] !== undefined) {
      extension[prop] = source[prop]
    }
  })

  nuObjs.forEach(o => {
    if (source[o]) {
      extension[o] = extension[o] || {}
      for (let i in source[o]) {
        extension[o][i] = source[o][i]
      }
    }
  })

  if (source.nutName) {
    schema.nutName = source.nutName
  }
  if (source.children) {
    extension.children = source.children
  }

  if (extension.children) {
    extension.children.forEach((child, i) => {
      extension.finalChildren[i] = getSchema(child)
    })
  }

  for (let i in extension) {
    schema[i] = extension[i]
  }
  return schema
}

module.exports = getSchema
