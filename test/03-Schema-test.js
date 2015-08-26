'use strict'

var expect = require('chai').expect,
    getSchema = require('../src/schema.js')

describe('Schema:', function () {
  it('has same properties as source when no extension passed', function () {
    var schema = getSchema({ scope: 'test' })
    expect(schema.scope).equals('test')
  })

  it('extend nut properties', function () {
    var schema = getSchema(
      {
        scope: 'test'
      }, {
        scope: 'extension',
        other: 'other'
      })
    expect(schema.scope).equals('test')
    expect(schema.other).equals('other')
  })

  it('extend attributes and variable attributes', function () {
    var schema = getSchema(
      {
        attribs: {
          other: 'src'
        },
        nuAtts: {
          other: 'src'
        }
      }, {
        attribs: {
          id: 'ext',
          other: 'ext'
        },
        nuAtts: {
          id: 'ext',
          other: 'ext'
        }
      })
    expect(schema.attribs.id).equals('ext')
    expect(schema.attribs.other).equals('src')
    expect(schema.nuAtts.id).equals('ext')
    expect(schema.nuAtts.other).equals('src')
  })

  it('extend nutName', function () {
    var schema = getSchema(
      {
        nutName: 'test'
      }, {
        nutName: 'other'
      })
    expect(schema.nutName).equals('test')
  })

  it('extend formats', function () {
    var schema = getSchema(
      {
        formats: ['test']
      }, {
        formats: ['other']
      })
    expect(schema.formats[0]).equals('test')
  })
})

