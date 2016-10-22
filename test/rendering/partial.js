'use strict'
const test = require('tape')
const Nuts = require('../../src/Nuts.js')

test('Partial: render simple partials', function (t) {
  let nuts = new Nuts()
  let tmpl = '<ul nut="simplePartialUl"><li nu-as="simplePartialLi"></li></ul>' +
    '<li nut="simplePartialLi" yeah="yeah">nuts</li>'
  nuts
  .addNuts(tmpl)
  .compile(function () {
    nuts.render('simplePartialUl', {}, function (err, html) {
      if (err) throw err
      t.is(html, '<ul><li yeah="yeah">nuts</li></ul>')
      t.end()
    })
  })
})

test('Partial: render complex partials', function (t) {
  let nuts = new Nuts()
  nuts
  .addFile('./test/assets/complex-partial.html')
  .compile(function () {
    nuts.render('blogDemo', {
      articles: [{
        title: 'you are a nut'
      }, {
        title: 'you are a nut'
      }]
    }, function (err, html) {
      if (err) throw err
      t.is(html,
        '<section>' +
          '<article><h1>you are a nut</h1></article>' +
          '<article><h1>you are a nut</h1></article>' +
        '</section>'
      )
      t.end()
    })
  })
})
