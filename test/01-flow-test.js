'use strict'

const expect = require('chai').expect,
      Nuts = require('../src/Nuts.js')

describe('Constructor', function () {
  let nuts = new Nuts()
  it('init nuts with constructor', function () {
    expect(nuts.Nuts).to.be.a('function')
  })
  it('init nuts with promises list', function () {
    expect(nuts.promises).to.be.a('array')
  })
  it('init nuts with error list', function () {
    expect(nuts.errors).to.be.a('array')
  })
})

describe('flow', function () {
  describe('nuts.then', function () {
    let nuts = new Nuts()

    it('add a function to promises list', function (done) {
      let myFn = function () {}
      myFn.test = 1
      nuts
      .then(myFn)
      expect(nuts.promises[0].test).to.equal(1)
      done()
    })
  })

  describe('nuts.exec', function () {
    let nuts = new Nuts()

    it('executes promises list and then callback', function (done) {
      let control = false
      let myFn = function (next) {
        next()
      }
      let myFn2 = function (next) {
        control = true
        next()
      }
      nuts
      .then(myFn)
      .then(myFn2)
      .exec(function () {
        expect(control).to.be.equal(true)
        expect(nuts.promises.length).to.be.equal(0)
        done()
      })
    })

    it('catches errors from promises list', function (done) {
      nuts
      .then([])
      .exec(function (err) {
        expect(err.message).to.equal('nuts.then requires a function as param')
        done()
      })
    })
  })
})
