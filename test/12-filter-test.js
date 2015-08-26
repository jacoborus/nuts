'use strict'

var expect = require('chai').expect,
  nuts = require('../index.js')

describe('Filters', function () {
  describe('Filter', function () {
    it('Filter simple data', function (done) {
      var tmpl = '<span nu-model="word" nut="simpleFilter"></span>'
      nuts
      .addNuts(tmpl)
      .addFilter('simpleFilter', {
        word: function (field, scope) {
          return 'get ' + field + '!'
        }
      })
      .compile(function () {
        nuts.render('simpleFilter', { word: 'nuts'}, function (err, rendered) {
          if (err) throw err
          expect(rendered).to.equal(
            '<span>get nuts!</span>'
         )
          done()
        })
      })
    })

    it('Filter looped data', function (done) {
      var loopedFilterTmpl = '<ul nut="loopedFilter">' +
          '<li nu-repeat="nums" nu-model></li>' +
        '</ul>'
      nuts
      .addNuts(loopedFilterTmpl)
      .addFilter('loopedFilter', {
        nums: function (val, scope) {
          var i
          for (i in val) {
            val[i] = val[i] + 1
          }
          return val
        }
      })
      .compile(function () {
        nuts.render('loopedFilter', { nums: [1, 2, 3]}, function (err, rendered) {
          if (err) throw err
          expect(rendered).to.equal(
            '<ul>' +
              '<li>2</li>' +
              '<li>3</li>' +
              '<li>4</li>' +
            '</ul>'
         )
          done()
        })
      })
    })

    it('Filter global data scope', function (done) {
      var tmpl = '<span nu-model="word" nut="globalFilter"></span>'
      nuts
      .addNuts(tmpl)
      .addFilter('simpleFilter', {
        _global: function (val) {
          val.word = 'get ' + val.word + '!'
          return val
        }
      })
      .compile(function () {
        nuts.render('simpleFilter', { word: 'nuts'}, function (err, rendered) {
          if (err) throw err
          expect(rendered).to.equal(
            '<span>get nuts!</span>'
         )
          done()
        })
      })
    })
  })
})
