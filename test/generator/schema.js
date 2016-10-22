'use strict'

const getSchema = require('../../src/schema.js')
const test = require('tape')

test('Schema:', function (t) {
  t.test('Schema: has same properties as source when no extension passed', function (tt) {
    let schema = getSchema({ scope: 'test' })
    tt.is(schema.scope, 'test')
    tt.end()
  })

  t.test('Schema: extend nut properties', function (tt) {
    let schema = getSchema({ scope: 'test' }, { scope: 'extension', other: 'other' })
    tt.is(schema.scope, 'test')
    tt.is(schema.other, 'other')
    tt.end()
  })

  t.test('Schema: extend attributes and variable attributes', function (tt) {
    let schema = getSchema(
      {attribs: { other: 'src' }, nuAtts: { other: 'src' }},
      {attribs: { id: 'ext', other: 'ext' }, nuAtts: { id: 'ext', other: 'ext' }}
    )
    tt.is(schema.attribs.id, 'ext')
    tt.is(schema.attribs.other, 'src')
    tt.is(schema.nuAtts.id, 'ext')
    tt.is(schema.nuAtts.other, 'src')
    tt.end()
  })

  t.test('Schema: extend nutName', function (tt) {
    let schema = getSchema({ nutName: 'test' }, { nutName: 'other' })
    tt.is(schema.nutName, 'test')
    tt.end()
  })

  t.test('extend formatters', function (tt) {
    let schema = getSchema({ formatters: ['test'] }, { formatters: ['other'] })
    tt.is(schema.formatters[0], 'test')
    tt.end()
  })
})

