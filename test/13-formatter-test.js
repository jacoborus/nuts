/*globals describe it */
'use strict'

var expect = require('chai').expect,
  Nuts = require('../src/Nuts.js')

describe('Formatters', function () {
  it('give simple format to partial nu-model', function (done) {
    var nuts = new Nuts()
    var tmpl = '<span nu-model="number | euro" nut="simpleFormatter"></span>'
    nuts
    .addNuts(tmpl)
    .addFormat('euro', function (val) {
      return val + '€'
    })
    .compile(function () {
      nuts.render('simpleFormatter', { number: 50 }, function (err, rendered) {
        if (err) throw err
        expect(rendered).to.equal('<span>50€</span>')
        done()
      })
    })
  })

  it('give simple format to full nu-model', function (done) {
    var nuts = new Nuts()
    var tmpl = '<span nu-model="| euro" nut="loopFormatter" nu-repeat="numbers"></span>'
    nuts
    .addNuts(tmpl)
    .addFormat('euro', function (val) {
      return val + '€'
    })
    .compile(function () {
      nuts.render('loopFormatter', { numbers: [ 2, 3 ]}, function (err, rendered) {
        if (err) throw err
        expect(rendered).to.equal('<span>2€</span><span>3€</span>')
        done()
      })
    })
  })

  it('give simple format to full nu-model with children', function (done) {
    var nuts = new Nuts()
    var tmpl = '<span nu-model="number | euro" nut="simpleFormatter">a</span>'
    nuts
    .addNuts(tmpl)
    .addFormat('euro', function (val) {
      return val + '€'
    })
    .compile(function () {
      nuts.render('simpleFormatter', { number: 50 }, function (err, rendered) {
        if (err) throw err
        expect(rendered).to.equal('<span>50€</span>')
        done()
      })
    })
  })

  it('give simple format to partial nu-model with children', function (done) {
    var nuts = new Nuts()
    var tmpl = '<span nu-model="| euro" nut="loopFormatter" nu-repeat="numbers">a</span>'
    nuts
    .addNuts(tmpl)
    .addFormat('euro', function (val) {
      return val + '€'
    })
    .compile(function () {
      nuts.render('loopFormatter', { numbers: [ 2, 3 ]}, function (err, rendered) {
        if (err) throw err
        expect(rendered).to.equal('<span>2€</span><span>3€</span>')
        done()
      })
    })
  })
})
