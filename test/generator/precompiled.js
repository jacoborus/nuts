'use strict'

const test = require('tape')
const getPrecompiled = require('../../src/precompiled.js')

test('Precompiled: separate regular attributes with nuNamesake', function (t) {
  let pre = getPrecompiled({
    attribs: {
      id: 'id'
    },
    nuAtts: {
      id: 'nuid',
      other: 'other'
    }
  })
  t.notOk(pre.attribs)
  t.is(pre.namesakes.id, 'id')
  t.is(pre.nuSakes.id, 'nuid')
  t.notOk(pre.attribs)
  t.is(pre.nuAtts.other, 'other')
  t.end()
})

test('Precompiled: add nuClass to regular attributes when no classlist', function (t) {
  let pre = getPrecompiled({
    nuClass: 'myclass'
  })
  t.is(pre.nuAtts.class, 'myclass')
  t.end()
})

test('Precompiled: add formatter methods', function (t) {
  let formatters = {
    myformat: function (val) {
      return val + '€'
    }
  }
  let pre = getPrecompiled({
    formatters: ['myformat']
  }, formatters)
  t.is(typeof pre.formatters[0], 'function')
  t.end()
})
