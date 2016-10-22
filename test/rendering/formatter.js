'use strict'

const Nuts = require('../../src/Nuts.js')
const test = require('tape')

test('Formatter: give simple format to partial nu-model', function (t) {
  let nuts = new Nuts()
  let tmpl = '<span nu-model="number | euro" nut="simpleFormatter"></span>'
  nuts
  .addNuts(tmpl)
  .addFormat('euro', function (val) {
    return val + '€'
  })
  .compile(function () {
    nuts.render('simpleFormatter', { number: 50 }, function (err, rendered) {
      t.notOk(err)
      t.is(rendered, '<span>50€</span>')
      t.end()
    })
  })
})

test('Formatter: give simple format to full nu-model', function (t) {
  let nuts = new Nuts()
  let tmpl = '<span nu-model="| euro" nut="loopFormatter" nu-repeat="numbers"></span>'
  nuts
  .addNuts(tmpl)
  .addFormat('euro', function (val) {
    return val + '€'
  })
  .compile(function () {
    nuts.render('loopFormatter', {numbers: [ 2, 3 ]}, function (err, rendered) {
      t.notOk(err)
      t.is(rendered, '<span>2€</span><span>3€</span>')
      t.end()
    })
  })
})

test('Formatter: give simple format to full nu-model with children', function (t) {
  let nuts = new Nuts()
  let tmpl = '<span nu-model="number | euro" nut="simpleFormatter">a</span>'
  nuts
  .addNuts(tmpl)
  .addFormat('euro', function (val) {
    return val + '€'
  })
  .compile(function () {
    nuts.render('simpleFormatter', { number: 50 }, function (err, rendered) {
      t.notOk(err)
      t.is(rendered, '<span>50€</span>')
      t.end()
    })
  })
})

test('Formatter: give simple format to partial nu-model with children', function (t) {
  let nuts = new Nuts()
  let tmpl = '<span nu-model="| euro" nut="loopFormatter" nu-repeat="numbers">a</span>'
  nuts
  .addNuts(tmpl)
  .addFormat('euro', function (val) {
    return val + '€'
  })
  .compile(function () {
    nuts.render('loopFormatter', {numbers: [ 2, 3 ]}, function (err, rendered) {
      t.notOk(err)
      t.is(rendered, '<span>2€</span><span>3€</span>')
      t.end()
    })
  })
})
