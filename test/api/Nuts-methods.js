'use strict'

const test = require('tape')
const Nuts = require('../../src/Nuts.js')
const path = require('path')

test('API: addNuts', function (t) {
  let nuts = new Nuts()
  t.test('store nuts from html into nuts archive', function (tt) {
    let tmpl = '<span nut="add1"></span><span nut="add2"></span>'
    nuts
    .addNuts(tmpl)
    .exec(function (err) {
      tt.notOk(err)
      tt.is(nuts.getNut('add1').nutName, 'add1')
      tt.is(nuts.getNut('add2').nutName, 'add2')
      tt.end()
    })
  })
  t.test('send errors to Nuts.errors', function (tt) {
    let tmpl = '<span></span>'
    nuts
    .addNuts(tmpl)
    .exec(function (err) {
      tt.ok(err)
      tt.end()
    })
  })
})

test('API: setTemplate', function (t) {
  let nuts = new Nuts()
  t.test('add a nut into nuts archive with passed keyname', function (tt) {
    let tmpl = '<span></span>'
    nuts
    .setTemplate('set1', tmpl)
    .setTemplate('set2', tmpl)
    .exec(function () {
      tt.is(nuts.getNut('set1').name, 'set1')
      tt.is(nuts.getNut('set2').name, 'set2')
      tt.end()
    })
  })
})

test('API: setTemplates', function (t) {
  let nuts = new Nuts()
  t.test('add nuts into nuts archive with passed keynames', function (tt) {
    let tmpl = '<span></span>'
    nuts
    .setTemplates({ set1: tmpl, set2: tmpl })
    .exec(function (err) {
      tt.notOk(err)
      tt.is(nuts.getNut('set1').name, 'set1')
      tt.is(nuts.getNut('set2').name, 'set2')
      tt.end()
    })
  })
})

test('API: addFile', function (t) {
  t.test('add nuts from file', function (tt) {
    let nuts = new Nuts()
    nuts
    .addFile(path.resolve(__dirname, '../assets/basic.html'))
    .addFile(path.resolve(__dirname, '../assets/basic2.html'))
    .exec(function (err) {
      tt.notOk(err)
      tt.is(nuts.getNut('basic1').nutName, 'basic1')
      tt.is(nuts.getNut('basic2').nutName, 'basic2')
      tt.is(nuts.getNut('basic3').nutName, 'basic3')
      tt.end()
    })
  })
})

test('API: addFolder', function (t) {
  t.test('add nuts from files in folder (recursive)', function (tt) {
    let nuts = new Nuts()
    nuts
    .addFolder(path.resolve(__dirname, '../assets/folder'))
    .exec(function (err) {
      tt.notOk(err)
      tt.is(nuts.getNut('basic1').nutName, 'basic1')
      tt.is(nuts.getNut('basic2').nutName, 'basic2')
      tt.is(nuts.getNut('basic3').nutName, 'basic3')
      tt.is(nuts.getNut('basic4').nutName, 'basic4')
      tt.end()
    })
  })
})

test('API: addFormat', function (t) {
  t.test('add formatters to Nuts', function (tt) {
    let nuts = new Nuts()
    nuts
    .addFormat('€', function (val) {
      return val + '€'
    })
    .exec(function (err) {
      tt.notOk(err)
      tt.is(typeof nuts.formatters['€'], 'function')
      tt.end()
    })
  })
})

test('API: addFilter', function (t) {
  t.test('add filters to Nuts', function (tt) {
    let nuts = new Nuts()
    nuts
    .addFilter('myFilter', function (val) {
      return val + '€'
    })
    .exec(function (err) {
      tt.notOk(err)
      tt.is(typeof nuts.filters['myFilter'], 'function')
      tt.end()
    })
  })

  t.test('add multiple filters', function (tt) {
    let nuts = new Nuts()
    nuts.addFilters({
      multiFilter1: {
        word: function (field) {
          return 'get ' + field + '!'
        }
      },
      multiFilter2: {
        word: function (field) {
          return 'get ' + field + '!'
        }
      }
    })
    .exec(function (err) {
      tt.notOk(err)
      tt.is(typeof nuts.filters['multiFilter1'], 'object')
      tt.is(typeof nuts.filters['multiFilter2'], 'object')
      tt.end()
    })
  })
})
