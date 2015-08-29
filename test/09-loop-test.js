'use strict'

const expect = require('chai').expect,
      Nuts = require('../src/Nuts.js')

describe('Loop:', function () {
  describe('Repeat:', function () {
    it('render simple array loops', function (done) {
      let nuts = new Nuts()

      let tmpl = '<ul nut="arrLoop" nu-scope="nums"><li nu-repeat nu-model></li></ul>'
      nuts
      .addNuts(tmpl)
      .compile(function () {
        nuts.render('arrLoop', { nums: [1, 2, 3]}, function (err, html) {
          if (err) throw err
          expect(html).to.equal('<ul><li>1</li><li>2</li><li>3</li></ul>')
          done()
        })
      })
    })

    it('render loops through repeat scope array', function (done) {
      let nuts = new Nuts()
      let tmpl = '<ul nut="arrLoopScoped"><li nu-repeat="nums" nu-model></li></ul>'
      nuts
      .addNuts(tmpl)
      .compile(function () {
        nuts.render('arrLoopScoped', { nums: [1, 2, 3]}, function (err, html) {
          if (err) throw err
          expect(html).to.equal('<ul><li>1</li><li>2</li><li>3</li></ul>')
          done()
        })
      })
    })
  })

  describe('Each:', function () {
    it('render simple array loops', function (done) {
      let nuts = new Nuts()

      let tmpl = '<ul nut="eachLoop" nu-scope="nums" nu-each>' +
          '<li nu-model></li>' +
        '</ul>'
      nuts
      .addNuts(tmpl)
      .compile(function () {
        nuts.render('eachLoop', { nums: [1, 2, 3]}, function (err, html) {
          if (err) throw err
          expect(html).to.equal(
            '<ul><li>1</li><li>2</li><li>3</li></ul>'
          )
          done()
        })
      })
    })

    it('render loops through repeat scope array', function (done) {
      let nuts = new Nuts()
      let tmpl = '<ul nu-each="nums" nut="eachLoopScoped">'
        + '<li nu-model></li></ul>'
      nuts
      .addNuts(tmpl)
      .compile(function () {
        nuts.render('eachLoopScoped', { nums: [1, 2, 3]}, function (err, html) {
          if (err) throw err
          expect(html).to.equal(
            '<ul><li>1</li><li>2</li><li>3</li></ul>'
          )
          done()
        })
      })
    })
  })
})

