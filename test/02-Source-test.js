'use strict'

const expect = require('chai').expect,
      parser = require('../src/parser.js'),
      getSource = require('../src/source.js')

const fn = function () {}

describe('Source', function () {
  it('contain parent nuts, render, compile and name', function (done) {
    let tmpl = '<ul nut="simpleTag"></ul>'

    parser(tmpl, (err, parsed) => {
      if (err) throw err
      let source = getSource(parsed[0], 5)
      expect(source.nutName).to.equal('simpleTag')
      done()
    })
  })

  it('generate a nut from template string', function (done) {
    let tmpl = '<ul nut="simpleTag"></ul>'

    parser(tmpl, function (err, parsed) {
      if (err) throw err
      let source = getSource(parsed[0])
      expect(source.type).to.equal('tag')
      expect(source.name).to.equal('ul')
      done()
    })
  })

  it('distribute special nuts attributes', function (done) {
    let tmpl = '<span' +
      ' class="class"' +
      ' nu-class="nuclass"' +
      // scopes
      ' nu-scope="scope"' +
      ' nu-model="model"' +
      ' nu-inherit="inherit"' +
      // conditionals
      ' nu-if="if"' +
      ' nu-unless="unless"' +
      // iterations
      ' nu-repeat="repeat"' +
      ' nu-each="each"' +
      // layouts
      ' nu-layout="layout"' +
      ' nu-block="head"' +
      ' nu-extend="extend"' +
      ' nu-as="nuas"' +
      ' nut="specialNuTs"' +
      // regular attributes
      ' myatt="myatt"' +
      ' custom="custom"' +
      // variable attribute
      ' nu-custom="custom"' +
      '>' +
      'hello' +
      '</span>'

    parser(tmpl, function (err, parsed) {
      let source = getSource(parsed[0], fn)

      expect(err).to.not.be.ok
      // class
      expect(source.class).to.equal('class')
      expect(source.nuAtts.class).to.not.exist
      // nuClass
      expect(source.nuClass).to.equal('nuclass')
      // scope
      expect(source.scope).to.equal('scope')
      expect(source.nuAtts.scope).to.not.exist
      // model
      expect(source.model).to.equal('model')
      expect(source.nuAtts.model).to.not.exist
      // inherit
      expect(source.inherit).to.equal('inherit')
      expect(source.nuAtts.inherit).to.not.exist
      // nuif
      expect(source.nuif).to.equal('if')
      expect(source.nuAtts.nuif).to.not.exist
      // unless
      expect(source.unless).to.equal('unless')
      expect(source.nuAtts.unless).to.not.exist
      // repeat
      expect(source.repeat).to.equal('repeat')
      expect(source.nuAtts.repeat).to.not.exist
      // each
      expect(source.each).to.equal('each')
      expect(source.nuAtts.each).to.not.exist
      // layout
      expect(source.layout).to.equal('layout')
      expect(source.nuAtts.layout).to.not.exist
      // block
      expect(source.block).to.equal('head')
      expect(source.nuAtts.block).to.not.exist
      // as
      expect(source.as).to.equal('nuas')
      expect(source.nuAtts.as).to.not.exist
      // extend
      expect(source.extend).to.equal('extend')
      expect(source.nuAtts.extend).to.not.exist
      // nut keyname
      expect(source.nutName).to.equal('specialNuTs')
      expect(source.nuAtts.nut).to.not.exist
      // doctype
      expect(source.doctype).to.equal(false)
      // regular attributes
      expect(source.attribs.myatt).to.equal('myatt')
      // variable attributes
      expect(source.nuAtts.custom).to.equal('custom')
      done()
    })
  })

  it('add boolean attributes to schema', function (done) {
    let tmpl = '<span nut="booleans" nu-bool-="myboolean">hello</span>'
    parser(tmpl, function (err, parsed) {
      let schema = getSource(parsed[0], fn)
      expect(err).to.not.be.ok
      expect(schema.booleans.bool).to.equal('myboolean')
      done()
    })
  })

  it('detect void elements', function (done) {
    let tmpl = '<input nut="voidelem">'
    parser(tmpl, function (err, parsed) {
      let schema0 = getSource(parsed[0], fn)
      expect(err).to.not.be.ok
      expect(schema0.voidElement).to.equal(true)
      done()
    })
  })

  it('detect formatters', function (done) {
    let tmpl = '<input nut="voidelem" nu-model=" model | format | other ">'
    parser(tmpl, function (err, parsed) {
      let schema0 = getSource(parsed[0], fn)
      expect(err).to.not.be.ok
      expect(schema0.formats[0]).to.equal('format')
      expect(schema0.formats[1]).to.equal('other')
      done()
    })
  })

  describe('doctypes', function () {
    it('detect HTML5', function (done) {
      let tmpl = '<html nu-doctype></html><html nu-doctype="5"></html>'
      parser(tmpl, function (err, parsed) {
        let schema0 = getSource(parsed[0], fn),
            schema1 = getSource(parsed[1], fn)
        expect(err).to.not.be.ok
        expect(schema0.doctype).to.equal('5')
        expect(schema1.doctype).to.equal('5')
        done()
      })
    })
    // HTML4
    it('detect HTML4 Strict', function (done) {
      let tmpl = '<html nu-doctype=4></html><html nu-doctype="4s"></html>'
      parser(tmpl, function (err, parsed) {
        let schema0 = getSource(parsed[0]),
            schema1 = getSource(parsed[1])
        expect(err).to.not.be.ok
        expect(schema0.doctype).to.equal('4s')
        expect(schema1.doctype).to.equal('4s')
        done()
      })
    })
    it('detect HTML4 Transactional', function (done) {
      let tmpl = '<html nu-doctype="4t"></html>'
      parser(tmpl, function (err, parsed) {
        let schema0 = getSource(parsed[0])
        expect(err).to.not.be.ok
        expect(schema0.doctype).to.equal('4t')
        done()
      })
    })
    it('detect HTML4 Frameset', function (done) {
      let tmpl = '<html nu-doctype="4f"></html>'
      parser(tmpl, function (err, parsed) {
        let schema0 = getSource(parsed[0])
        expect(err).to.not.be.ok
        expect(schema0.doctype).to.equal('4f')
        done()
      })
    })
    // XHTML1.0
    it('detect XHTML1.0 Strict', function (done) {
      let tmpl = '<html nu-doctype="x"></html><html nu-doctype="xs"></html>'
      parser(tmpl, function (err, parsed) {
        let schema0 = getSource(parsed[0]),
            schema1 = getSource(parsed[1])
        expect(err).to.not.be.ok
        expect(schema0.doctype).to.equal('xs')
        expect(schema1.doctype).to.equal('xs')
        done()
      })
    })
    it('detect XHTML1.0 Transactional', function (done) {
      let tmpl = '<html nu-doctype="xt"></html>'
      parser(tmpl, function (err, parsed) {
        let schema0 = getSource(parsed[0])
        expect(err).to.not.be.ok
        expect(schema0.doctype).to.equal('xt')
        done()
      })
    })
    it('detect XHTML1.0 Frameset', function (done) {
      let tmpl = '<html nu-doctype="xf"></html>'
      parser(tmpl, function (err, parsed) {
        let schema0 = getSource(parsed[0])
        expect(err).to.not.be.ok
        expect(schema0.doctype).to.equal('xf')
        done()
      })
    })
    // XHTML1.1
    it('detect XHTML1.1', function (done) {
      let tmpl = '<html nu-doctype="xx"></html><html nu-doctype="11"></html>'
      parser(tmpl, function (err, parsed) {
        let schema0 = getSource(parsed[0]),
            schema1 = getSource(parsed[1])
        expect(err).to.not.be.ok
        expect(schema0.doctype).to.equal('xx')
        expect(schema1.doctype).to.equal('xx')
        done()
      })
    })
  })
})
