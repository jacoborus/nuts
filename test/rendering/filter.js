'use strict'

const nuts = require('../../index.js')
const test = require('tape')

test('Filter simple data', function (t) {
  let tmpl = '<span nu-model="word" nut="simpleFilter"></span>'
  nuts
  .addNuts(tmpl)
  .addFilter('simpleFilter', {
    word: function (field) {
      return 'get ' + field + '!'
    }
  })
  .compile(function () {
    nuts.render('simpleFilter', {word: 'nuts'}, function (err, rendered) {
      if (err) throw err
      t.is(rendered, '<span>get nuts!</span>')
      t.end()
    })
  })
})

test('Filter looped data', function (t) {
  let loopedFilterTmpl = '<ul nut="loopedFilter">' +
      '<li nu-repeat="nums" nu-model></li>' +
    '</ul>'
  nuts
  .addNuts(loopedFilterTmpl)
  .addFilter('loopedFilter', {
    nums: function (val) {
      let i
      for (i in val) {
        val[i] = val[i] + 1
      }
      return val
    }
  })
  .compile(function () {
    nuts.render('loopedFilter', {nums: [1, 2, 3]}, function (err, rendered) {
      if (err) throw err
      t.is(rendered,
        '<ul>' +
          '<li>2</li>' +
          '<li>3</li>' +
          '<li>4</li>' +
        '</ul>'
     )
      t.end()
    })
  })
})

test('Filter global data scope', function (t) {
  let tmpl = '<span nu-model="word" nut="globalFilter"></span>'
  nuts
  .addNuts(tmpl)
  .addFilter('simpleFilter', {
    _global: function (val) {
      val.word = 'get ' + val.word + '!'
      return val
    }
  })
  .compile(function () {
    nuts.render('simpleFilter', {word: 'nuts'}, function (err, rendered) {
      if (err) throw err
      t.is(rendered, '<span>get nuts!</span>')
      t.end()
    })
  })
})
