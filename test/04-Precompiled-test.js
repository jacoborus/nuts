/*globals describe it*/
'use strict'

var expect = require('chai').expect,
  Precompiled = require('../src/Precompiled.js')

describe('Precompiled', function () {
  it('separate regular attributes with nuNamesake', function () {
    var pre = new Precompiled({
      attribs: {
        id: 'id'
      },
      nuAtts: {
        id: 'nuid',
        other: 'other'
      }
    })
    expect(pre.attribs).to.not.exist
    expect(pre.namesakes.id).to.equal('id')
    expect(pre.nuSakes.id).to.equal('nuid')
    expect(pre.attribs).to.not.exist
    expect(pre.nuAtts.other).to.equal('other')
  })

  it('add nuClass to regular attributes when no classlist', function () {
    var pre = new Precompiled({
      nuClass: 'myclass'
    })
    expect(pre.nuAtts.class).to.equal('myclass')
  })

  it('add formatter methods', function () {
    var formats = {
      myformat: function (val) {
        return val + '€'
      }
    }
    var pre = new Precompiled({
      formats: ['myformat']
    }, formats)
    expect(pre.formats[0]).to.be.a('function')
  })
})
