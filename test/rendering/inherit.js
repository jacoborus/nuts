'use strict'

const test = require('tape')
const nuts = require('../../index.js')

test('Inherit: extend data with parent', function (t) {
  let tmpl = '<article nu-scope="person" nut="directExtend">' +
      '<h1 nu-model="name"></h1>' +
      '<div nu-scope="skills" nu-inherit>' +
        '<span nu-model="js"></span>' +
        '<span nu-model="city"></span>' +
        '<span nu-model="name"></span>' +
      '</div>' +
    '</article>'
  nuts
  .addNuts(tmpl)
  .compile(function () {
    nuts.render('directExtend', { person: {
      name: 'Jacobo',
      city: 'DF',
      skills: {
        js: 9,
        html: 8
      }
    }}, function (err, html) {
      if (err) throw err
      t.is(html, '<article>' +
        '<h1>Jacobo</h1>' +
        '<div>' +
        '<span>9</span>' +
        '<span>DF</span>' +
        '<span>Jacobo</span>' +
        '</div>' +
        '</article>'
      )
      t.end()
    })
  })
})

test('Inherit: extend by select properties from parent', function (t) {
  let tmpl = '<article nu-scope="person" nut="selectExtend">' +
        '<h1 nu-model="name"></h1>' +
        '<div nu-scope="skills" nu-inherit="city">' +
          '<span nu-model="js"></span>' +
          '<span nu-model="city"></span>' +
          '<span nu-model="name"></span>' +
        '</div>' +
      '</article>'
  nuts
  .addNuts(tmpl)
  .compile(function () {
    nuts.render('selectExtend', { person: {
      name: 'Jacobo',
      city: 'DF',
      skills: {
        js: 9,
        html: 8
      }
    }}, function (err, html) {
      if (err) throw err
      t.is(html, '<article>' +
        '<h1>Jacobo</h1>' +
        '<div>' +
        '<span>9</span>' +
        '<span>DF</span>' +
        '<span></span>' +
        '</div>' +
        '</article>'
      )
      t.end()
    })
  })
})
