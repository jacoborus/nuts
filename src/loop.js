'use strict'

const newCounter = function (limit, callback) {
  let count = 0
  return function (err) {
    if (err) { return callback(err) }
    if (++count === limit) {
      callback()
    }
  }
}

const sequence = function (target, fns, callback) {
  callback = callback || function (err) {
    if (err) { throw err }
  }
  if (target.errors.length) {
    return callback(new Error(target.errors[0]))
  }
  let next = function (err) {
    if (err) { return callback(err) }
    if (!fns.length) {
      return callback()
    }
    fns.shift().call(target, next)
  }
  next()
}

module.exports = {
  newCounter: newCounter,
  sequence: sequence
}
