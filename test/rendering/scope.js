'use strict'

const test = require('tape')
const Nuts = require('../../src/Nuts.js')

test('Render scope: render simple data', function (t) {
  let nuts = new Nuts()
  let tmpl = '<span nut="simpleData" nu-model="word">hi</span>'
  nuts
  .addNuts(tmpl)
  .compile(function (err) {
    t.notOk(err)
    nuts.render('simpleData', { word: 'bye' }, function (err, html) {
      t.notOk(err)
      t.is(html, '<span>bye</span>')
      t.end()
    })
  })
})

test('Render scope: render data inside inner tags', function (t) {
  let nuts = new Nuts()
  let tmpl = '<ul nut="dataThrough"><li nu-model="word">hi</li></ul>'
  nuts
  .addNuts(tmpl)
  .compile(function (err) {
    t.notOk(err)
    nuts.render('dataThrough', { word: 'bye' }, function (err, html) {
      t.notOk(err)
      t.is(html, '<ul><li>bye</li></ul>')
      t.end()
    })
  })
})

test('Render scope: render data passed through scope', function (t) {
  let nuts = new Nuts()
  let tmpl = '<ul nut="basicScope" nu-scope="card"><li nu-model="name">no name</li></ul>'
  nuts
  .addNuts(tmpl)
  .compile(function (err) {
    t.notOk(err)
    nuts.render('basicScope', {card: { name: 'Name' }}, function (err, html) {
      t.notOk(err)
      t.is(html, '<ul><li>Name</li></ul>')
      t.end()
    })
  })
})

test('Render scope: use children dom elem if there is no model in data', function (t) {
  let nuts = new Nuts()
  let tmpl = '<ul nut="basicScope" nu-scope="card"><li nu-model="name">no name</li></ul>'
  nuts
  .addNuts(tmpl)
  .compile(function (err) {
    t.notOk(err)
    nuts.render('basicScope', {card: {}}, function (err, html) {
      t.is(html, '<ul><li>no name</li></ul>')
      t.notOk(err)
      t.end()
    })
  })
})

test('Render scope: render data passed through multiple scopes', function (t) {
  let nuts = new Nuts()
  let tmpl = '<div  nut="doubleScope">' +
    '<ul nu-scope="card">' +
    '<li nu-model="name">no name</li>' +
    '</ul></div>'
  nuts
  .addNuts(tmpl)
  .compile(function (err) {
    t.notOk(err)
    nuts.render('doubleScope', {card: { name: 'Name' }}, function (err, html) {
      t.notOk(err)
      t.is(html, '<div><ul><li>Name</li></ul></div>')
      t.end()
    })
  })
})

test('Render scope: render attributes from data', function (t) {
  let nuts = new Nuts()
  let tmpl = '<span nut="nuAtts" nu-id="color"></span>'
  nuts
  .addNuts(tmpl)
  .compile(function () {
    nuts.render('nuAtts', { color: 'white' }, function (err, html) {
      t.is(html, '<span id="white"></span>')
      t.notOk(err)
      t.end()
    })
  })
})

test('Render scope: render attributes with namesake', function (t) {
  let nuts = new Nuts()
  let tmpl = '<span nut="nuSakes" id="id" nu-id="nuid"></span>'
  nuts
  .addNuts(tmpl)
  .compile(function () {
    nuts.render('nuSakes', {nuid: 'white'}, function (err, html) {
      t.notOk(err)
      t.is(html, '<span id="white"></span>')
      nuts.render('nuSakes', {}, function (err, html) {
        t.notOk(err)
        t.is(html, '<span id="id"></span>')
        t.end()
      })
    })
  })
})

test('Render scope: render className from data', function (t) {
  let nuts = new Nuts()
  let tmpl = '<span nut="classData" class="featured" nu-class="nuclass">bye</span>'
  nuts
  .addNuts(tmpl)
  .compile(function (err) {
    t.notOk(err)
    nuts.render('classData', { nuclass: 'white' }, function (err, html) {
      t.notOk(err)
      t.is(html, '<span class="featured white">bye</span>')
      t.end()
    })
  })
})

test('Render scope: Inserts the element only when nuif value evaluates to true', function (t) {
  let nuts = new Nuts()
  let tmpl = '<span nut="nuif" nu-if="color">hi</span>'
  nuts
  .addNuts(tmpl)
  .compile(function () {
    nuts.render('nuif', {color: true}, function (err, html) {
      t.notOk(err)
      t.is(html, '<span>hi</span>')
      nuts.render('nuif', {}, function (err, html) {
        t.notOk(err)
        t.is(html, '')
        t.end()
      })
    })
  })
})

test('Render scope: Inserts the loop when the value evaluates to true', function (t) {
  let nuts = new Nuts()
  let tmpl = '<span nut="ifloop" nu-if="featured" nu-repeat="colors" nu-model="name">hi</span>'
  nuts
  .addNuts(tmpl)
  .compile(function () {
    nuts.render(
      'ifloop',
      { colors: [
        {
          name: 'blue',
          featured: true
        }, {
          name: 'red',
          featured: false
        }
      ]},
      function (err, html) {
        t.notOk(err)
        t.is(html, '<span>blue</span>')
        t.end()
      }
    )
  })
})
