'use strict'

const expect = require('chai').expect,
      Nuts = require('../../src/Nuts.js')

describe('Scope', function () {
  it('render simple data', function (done) {
    let nuts = new Nuts()
    let tmpl = '<span nut="simpleData" nu-model="word">hi</span>'
    nuts
    .addNuts(tmpl)
    .compile(function (err) {
      expect(err).to.not.be.ok
      nuts.render('simpleData', { word: 'bye' }, function (err, html) {
        expect(err).to.not.be.ok
        expect(html).to.equal('<span>bye</span>')
        done()
      })
    })
  })

  it('render data inside inner tags', function (done) {
    let nuts = new Nuts()
    let tmpl = '<ul nut="dataThrough"><li nu-model="word">hi</li></ul>'
    nuts
    .addNuts(tmpl)
    .compile(function (err) {
      expect(err).to.not.be.ok
      nuts.render('dataThrough', { word: 'bye' }, function (err, html) {
        expect(err).to.not.be.ok
        expect(html).to.equal('<ul><li>bye</li></ul>')
        done()
      })
    })
  })

  it('render data passed through scope', function (done) {
    let nuts = new Nuts()
    let tmpl = '<ul nut="basicScope" nu-scope="card"><li nu-model="name">no name</li></ul>'
    nuts
    .addNuts(tmpl)
    .compile(function (err) {
      expect(err).to.not.be.ok
      nuts.render('basicScope', { card: { name: 'Name' }}, function (err, html) {
        expect(err).to.not.be.ok
        expect(html).to.equal('<ul><li>Name</li></ul>')
        done()
      })
    })
  })

  it('use children dom elem if there is no model in data', function (done) {
    let nuts = new Nuts()
    let tmpl = '<ul nut="basicScope" nu-scope="card"><li nu-model="name">no name</li></ul>'
    nuts
    .addNuts(tmpl)
    .compile(function (err) {
      expect(err).to.not.be.ok
      nuts.render('basicScope', { card: { }}, function (err, html) {
        expect(html).to.equal('<ul><li>no name</li></ul>')
        expect(err).to.not.be.ok
        done()
      })
    })
  })

  it('render data passed through multiple scopes', function (done) {
    let nuts = new Nuts()
    let tmpl = '<div  nut="doubleScope">' +
      '<ul nu-scope="card">' +
      '<li nu-model="name">no name</li>' +
      '</ul></div>'
    nuts
    .addNuts(tmpl)
    .compile(function (err) {
      expect(err).to.not.be.ok
      nuts.render('doubleScope', { card: { name: 'Name' }}, function (err, html) {
        expect(err).to.not.be.ok
        expect(html).to.equal('<div><ul><li>Name</li></ul></div>')
        done()
      })
    })
  })

  it('render attributes from data', function (done) {
    let nuts = new Nuts()
    let tmpl = '<span nut="nuAtts" nu-id="color"></span>'
    nuts
    .addNuts(tmpl)
    .compile(function () {
      nuts.render('nuAtts', { color: 'white' }, function (err, html) {
        expect(html).to.equal('<span id="white"></span>')
        expect(err).to.not.be.ok
        done()
      })
    })
  })

  it('render attributes with namesake', function (done) {
    let nuts = new Nuts()
    let tmpl = '<span nut="nuSakes" id="id" nu-id="nuid"></span>'
    nuts
    .addNuts(tmpl)
    .compile(function () {
      nuts.render('nuSakes', {nuid: 'white'}, function (err, html) {
        expect(err).to.not.be.ok
        expect(html).to.equal('<span id="white"></span>')
        nuts.render('nuSakes', {}, function (err, html) {
          expect(err).to.not.be.ok
          expect(html).to.equal('<span id="id"></span>')
          done()
        })
      })
    })
  })

  it('render className from data', function () {
    let nuts = new Nuts()
    let tmpl = '<span nut="classData" class="featured" nu-class="nuclass">bye</span>'
    nuts
    .addNuts(tmpl)
    .compile(function (err) {
      expect(err).to.not.be.ok
      nuts.render('classData', { nuclass: 'white' }, function (err, html) {
        expect(err).to.not.be.ok
        expect(html).to.equal('<span class="featured white">bye</span>')
      })
    })
  })

  it('Inserts the element only when nuif value evaluates to true', function (done) {
    let nuts = new Nuts()
    let tmpl = '<span nut="nuif" nu-if="color">hi</span>'
    nuts
    .addNuts(tmpl)
    .compile(function () {
      nuts.render('nuif', {color: true}, function (err, html) {
        expect(err).to.not.be.ok
        expect(html).to.equal('<span>hi</span>')
        nuts.render('nuif', {}, function (err, html) {
          expect(err).to.not.be.ok
          expect(html).to.equal('')
          done()
        })
      })
    })
  })

  it('Inserts the loop when the value evaluates to true', function (done) {
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
          expect(err).to.not.be.ok
          expect(html).to.equal('<span>blue</span>')
          done()
        }
      )
    })
  })
})
