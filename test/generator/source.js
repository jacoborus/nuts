'use strict'

const test = require('tape')
const parser = require('../../src/parser.js')
const getSource = require('../../src/source.js')

const fn = function () {}

test('Source', function (t) {
  t.test('contain parent nuts, render, compile and name', function (tt) {
    let tmpl = '<ul nut="simpleTag"></ul>'

    parser(tmpl, (err, parsed) => {
      if (err) throw err
      let source = getSource(parsed[0], 5)
      tt.is(source.nutName, 'simpleTag')
      tt.end()
    })
  })

  t.test('generate a nut from template string', function (tt) {
    let tmpl = '<ul nut="simpleTag"></ul>'

    parser(tmpl, function (err, parsed) {
      if (err) throw err
      let source = getSource(parsed[0])
      tt.is(source.type, 'tag')
      tt.is(source.name, 'ul')
      tt.end()
    })
  })

  t.test('distribute special nuts attributes', function (tt) {
    let tmpl = '<span' +
      ' class="class"' +
      ' nu-class="nuclass"' +
      // scopes
      ' nu-scope="scope"' +
      ' nu-model="model"' +
      ' nu-inherit="inherit"' +
      // conditionals
      ' nu-if="if"' +
      ' nu-unless="unless"' +
      // iterations
      ' nu-repeat="repeat"' +
      ' nu-each="each"' +
      // layouts
      ' nu-layout="layout"' +
      ' nu-block="head"' +
      ' nu-extend="extend"' +
      ' nu-as="nuas"' +
      ' nut="specialNuTs"' +
      // regular attributes
      ' myatt="myatt"' +
      ' custom="custom"' +
      // variable attribute
      ' nu-custom="custom"' +
      '>' +
      'hello' +
      '</span>'

    parser(tmpl, function (err, parsed) {
      let source = getSource(parsed[0], fn)

      tt.notOk(err)
      // class
      tt.is(source.class, 'class')
      tt.notOk(source.nuAtts.class)
      // nuClass
      tt.is(source.nuClass, 'nuclass')
      // scope
      tt.is(source.scope, 'scope')
      tt.notOk(source.nuAtts.scope)
      // model
      tt.is(source.model, 'model')
      tt.notOk(source.nuAtts.model)
      // nuif
      tt.is(source.nuif, 'if')
      tt.notOk(source.nuAtts.nuif)
      // unless
      tt.is(source.unless, 'unless')
      tt.notOk(source.nuAtts.unless)
      // repeat
      tt.is(source.repeat, 'repeat')
      tt.notOk(source.nuAtts.repeat)
      // each
      tt.is(source.each, 'each')
      tt.notOk(source.nuAtts.each)
      // layout
      tt.is(source.layout, 'layout')
      tt.notOk(source.nuAtts.layout)
      // block
      tt.is(source.block, 'head')
      tt.notOk(source.nuAtts.block)
      // as
      tt.is(source.as, 'nuas')
      tt.notOk(source.nuAtts.as)
      // extend
      tt.is(source.extend, 'extend')
      tt.notOk(source.nuAtts.extend)
      // nut keyname
      tt.is(source.nutName, 'specialNuTs')
      tt.notOk(source.nuAtts.nut)
      // doctype
      tt.is(source.doctype, false)
      // regular attributes
      tt.is(source.attribs.myatt, 'myatt')
      // variable attributes
      tt.is(source.nuAtts.custom, 'custom')
      tt.end()
    })
  })

  t.test('add boolean attributes to schema', function (tt) {
    let tmpl = '<span nut="booleans" nu-bool-="myboolean">hello</span>'
    parser(tmpl, function (err, parsed) {
      let schema = getSource(parsed[0], fn)
      tt.notOk(err)
      tt.is(schema.booleans.bool, 'myboolean')
      tt.end()
    })
  })

  t.test('detect void elements', function (tt) {
    let tmpl = '<input nut="voidelem">'
    parser(tmpl, function (err, parsed) {
      let schema0 = getSource(parsed[0], fn)
      tt.notOk(err)
      tt.is(schema0.voidElement, true)
      tt.end()
    })
  })

  t.test('detect formatters', function (tt) {
    let tmpl = '<input nut="voidelem" nu-model=" model | format | other ">'
    parser(tmpl, function (err, parsed) {
      let schema0 = getSource(parsed[0], fn)
      tt.notOk(err)
      tt.is(schema0.formatters[0], 'format')
      tt.is(schema0.formatters[1], 'other')
      tt.end()
    })
  })

  t.test('detect HTML5', function (tt) {
    let tmpl = '<html nu-doctype></html><html nu-doctype="5"></html>'
    parser(tmpl, function (err, parsed) {
      let schema0 = getSource(parsed[0], fn)
      let schema1 = getSource(parsed[1], fn)
      tt.notOk(err)
      tt.is(schema0.doctype, '5')
      tt.is(schema1.doctype, '5')
      tt.end()
    })
  })
})
