/*globals describe it*/
'use strict'

var expect = require('chai').expect,
  parser = require('../src/parser.js'),
  Nut = require('../src/Nut.js')

describe('Nut constructor', function () {
  it('initialize nut with source, nutName, nuts and type', function (done) {
    var tmpl = '<ul nut="simpleTag" nu-as="mypart"></ul>'
    parser(tmpl, function (err, parsed) {
      if (err) throw err
      var nut = new Nut(parsed[ 0 ], { templates: { }})
      expect(nut.source.nutName).to.equal('simpleTag')
      expect(nut.nutName).to.equal('simpleTag')
      expect(nut.source.nutName).to.equal('simpleTag')
      expect(nut.partial).to.equal('mypart')
      done()
    })
  })

  it('add children to schema', function (done) {
    var tmpl = '<span nut="withchildren">hello</span>'
    parser(tmpl, function (err, parsed) {
      expect(err).to.not.be.ok
      var nut = new Nut(parsed[ 0 ], { templates: { }})
      expect(nut.children).to.be.a('array')
      done()
    })
  })

  it('set partial', function (done) {
    var tmpl = '<span nut="withchildren" nu-as="superpartial">hello</span>'
    parser(tmpl, function (err, parsed) {
      expect(err).to.not.be.ok
      var nut = new Nut(parsed[ 0 ], { templates: { }})
      expect(nut.partial).to.equal('superpartial')
      done()
    })
  })

  it('set partials from children', function (done) {
    var tmpl = '<span nut="withchildren">' +
        '<span nu-as="superpartial"></span>' +
        '<span nu-as="megapartial"></span>' +
      '</span>'
    parser(tmpl, function (err, parsed) {
      expect(err).to.not.be.ok
      var nut = new Nut(parsed[ 0 ], { templates: { }})
      expect(nut.partials[0]).to.equal('superpartial')
      expect(nut.partials[1]).to.equal('megapartial')
      done()
    })
  })
})
