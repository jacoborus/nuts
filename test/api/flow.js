'use strict'

const test = require('tape')
const Nuts = require('../../src/Nuts.js')

// Constructor

test('basic constructor', function (t) {
  let nuts = new Nuts()
  t.is(typeof nuts.Nuts, 'function', 'init nuts with constructor')
  t.is(Array.isArray(nuts.queue), true, 'init nuts with queue')
  t.is(Array.isArray(nuts.errors), true, 'init nuts with error list')
  t.end()
})
test('live mode', function (t) {
  let nuts = new Nuts(true)
  t.is(typeof nuts.Nuts, 'function', 'init nuts with constructor')
  t.is(nuts.liveMode, true, 'set browser live templates flag when first params evalues to true')
  t.end()
})

// FLOW
test('nuts.then', function (t) {
  let nuts = new Nuts()

  let myFn = function () {}
  myFn.test = 1
  nuts.then(myFn)
  t.is(nuts.queue[0].test, 1, 'add a function to promises list')
  t.end()
})

test('executes promises list and then callback', function (t) {
  let nuts = new Nuts()

  t.test('executes promises list and then callback', tt => {
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
        tt.is(control, true)
        tt.is(nuts.queue.length, 0)
        tt.end()
      })
  })

  t.test('catches errors from promises list', function (tt) {
    nuts
    .then([])
    .exec(function (err) {
      tt.is(err.message, 'nuts.then requires a function as param')
      tt.end()
    })
  })
})
