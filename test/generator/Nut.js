'use strict'

const test = require('tape')
const parser = require('../../src/parser.js')
const Nut = require('../../src/Nut.js')

test('Nut construct: initialize nut with source, nutName, nuts and type', function (t) {
  let tmpl = '<ul nut="simpleTag" nu-as="mypart"></ul>'
  parser(tmpl, function (err, parsed) {
    if (err) throw err
    let nut = new Nut(parsed[0], {templates: {}})
    t.is(nut.source.nutName, 'simpleTag')
    t.is(nut.nutName, 'simpleTag')
    t.is(nut.source.nutName, 'simpleTag')
    t.is(nut.partial, 'mypart')
    t.end()
  })
})

test('Nut constructor: add children to schema', function (t) {
  let tmpl = '<span nut="withchildren">hello</span>'
  parser(tmpl, function (err, parsed) {
    t.notOk(err)
    let nut = new Nut(parsed[0], {templates: {}})
    t.is(Array.isArray(nut.children), true)
    t.end()
  })
})

test('Nut constructor: set partial', function (t) {
  let tmpl = '<span nut="withchildren" nu-as="superpartial">hello</span>'
  parser(tmpl, function (err, parsed) {
    t.notOk(err)
    let nut = new Nut(parsed[0], {templates: {}})
    t.is(nut.partial, 'superpartial')
    t.end()
  })
})

test('Nut constructor: set partials from children', function (t) {
  let tmpl = '<span nut="withchildren">' +
      '<span nu-as="superpartial"></span>' +
      '<span nu-as="megapartial"></span>' +
    '</span>'
  parser(tmpl, function (err, parsed) {
    t.notOk(err)
    let nut = new Nut(parsed[0], {templates: {}})
    t.is(nut.partials[0], 'superpartial')
    t.is(nut.partials[1], 'megapartial')
    t.end()
  })
})
