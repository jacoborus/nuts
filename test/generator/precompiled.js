'use strict'

const expect = require('chai').expect,
      getPrecompiled = require('../../src/precompiled.js')

describe('Precompiled', function () {
  it('separate regular attributes with nuNamesake', function () {
    let pre = getPrecompiled({
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
    let pre = getPrecompiled({
      nuClass: 'myclass'
    })
    expect(pre.nuAtts.class).to.equal('myclass')
  })

  it('add formatter methods', function () {
    let formatters = {
      myformat: function (val) {
        return val + '€'
      }
    }
    let pre = getPrecompiled({
      formatters: ['myformat']
    }, formatters)
    expect(pre.formatters[0]).to.be.a('function')
  })
})
