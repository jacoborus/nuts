'use strict'

const Nuts = require('../../src/Nuts.js')
const test = require('tape')

test('Loop - Repeat:', function (t) {
  t.test('render simple array loops', function (tt) {
    let nuts = new Nuts()

    let tmpl = '<ul nut="arrLoop" nu-scope="nums"><li nu-repeat nu-model></li></ul>'
    nuts
    .addNuts(tmpl)
    .compile(function () {
      nuts.render('arrLoop', {nums: [1, 2, 3]}, function (err, html) {
        tt.notOk(err)
        tt.is(html, '<ul><li>1</li><li>2</li><li>3</li></ul>')
        tt.end()
      })
    })
  })

  t.test('render loops through repeat scope array', function (tt) {
    let nuts = new Nuts()
    let tmpl = '<ul nut="arrLoopScoped"><li nu-repeat="nums" nu-model></li></ul>'
    nuts
    .addNuts(tmpl)
    .compile(function () {
      nuts.render('arrLoopScoped', {nums: [1, 2, 3]}, function (err, html) {
        tt.notOk(err)
        tt.is(html, '<ul><li>1</li><li>2</li><li>3</li></ul>')
        tt.end()
      })
    })
  })
})

test('Loop - Each:', function (t) {
  t.test('render simple array loops', function (tt) {
    let nuts = new Nuts()

    let tmpl = '<ul nut="eachLoop" nu-scope="nums" nu-each>' +
        '<li nu-model></li>' +
      '</ul>'
    nuts
    .addNuts(tmpl)
    .compile(function () {
      nuts.render('eachLoop', {nums: [1, 2, 3]}, function (err, html) {
        tt.notOk(err)
        tt.is(html, '<ul><li>1</li><li>2</li><li>3</li></ul>')
        tt.end()
      })
    })
  })

  t.test('render loops through repeat scope array', function (tt) {
    let nuts = new Nuts()
    let tmpl = '<ul nu-each="nums" nut="eachLoopScoped"><li nu-model></li></ul>'
    nuts
    .addNuts(tmpl)
    .compile(function () {
      nuts.render('eachLoopScoped', {nums: [1, 2, 3]}, function (err, html) {
        tt.notOk(err)
        tt.is(html, '<ul><li>1</li><li>2</li><li>3</li></ul>')
        tt.end()
      })
    })
  })
})
