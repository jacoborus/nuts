'use strict'

var Nut = require('./Nut.js'),
    parser = require('./parser.js'),
    recursive = require('recursive-readdir'),
    fs = require('fs'),
    path = require('path'),
    newCounter = require('./loop.js').newCounter,
    sequence = require('./loop.js').sequence

var hasSchemas = function (item) {
  var templates = item.nuts.templates,
    partials = item.partials,
    i

  if (item.partial && !templates[ item.partial ].schema) {
    return false
  }

  for (i in partials) {
    if (!templates[ partials[ i ]].schema) {
      return false
    }
  }
  return true
}

var makeSchemas = function (list, items, callback) {
  list.forEach(function () {
    var key = list.shift(),
      item = items[key]

    if (hasSchemas(item)) {
      item.schema = item.getSchema()
    } else {
      list.push(key)
    }
  })

  if (list.length) {
    return makeSchemas(list, items, callback)
  }
  callback()
}

var compile = function (next) {
  var keys = Object.keys(this.templates),
    nut = this,
    len = keys.length,
    i

  if (!len) {
    return next()
  }

  makeSchemas(keys, this.templates, function () {
    for (i in nut.items) {
      nut.items[i].precompiled = nut.items[i].getPrecompiled()
    }

    for (i in nut.items) {
      nut.items[i].render = nut.items[i].getRender()
    }
    nut.compiled = true
    next()
  })
}

// nuts constructor
var Nuts = function () {
  this.compiled = false
  this.Nuts = Nuts
  this.items = {}
  this.formats = {}
  this.filters = {}
  this.promises = []
  this.errors = []
  this.templates = {}
}

/**
 * Add a new promise in the stack
 * @param  {Function} fn method
 * @return {Object}      nuts
 */
Nuts.prototype.then = function (fn) {
  if (typeof fn !== 'function') {
    this.errors.push('nuts.then requires a function as param')
    return this
  }
  this.promises.push(fn)
  return this
}

Nuts.prototype.exec = function (callback) {
  callback = callback || function () {}
  var fns = this.promises.slice()
  this.promises = []
  sequence(this, fns, callback)
}

Nuts.prototype.getNut = function (keyname) {
  return this.items[keyname]
}

/*!
 * Add templates to archive
 * @param {String}   html text with nuts
 * @param {Function} next launch next function in the stack
 */
var addNuts = function (html, next) {
  var nuts = this
  this.compiled = false

  parser(html, function (err, parsed) {
    if (err) {
      return nuts.errors.push(err)
    }
    if (!parsed.length) {
      return next()
    }
    var count = newCounter(parsed.length, next)
    parsed.forEach(function (parsedNut) {
      if (parsedNut.type === 'text' && parsedNut.data.trim() === '') {
        return count()
      }
      var nut = new Nut(parsedNut, nuts)
      if (!nut.nutName) {
        return next('Nuts templates requires nut attribute')
      }
      nuts.items[ nut.nutName ] = nut
      count()
    })
  })

  return this
}

Nuts.prototype.addNuts = function (html) {
  var nuts = this
  this.promises.push(function (next) {
    addNuts.call(nuts, html, next)
  })
  return this
}

Nuts.prototype.setTemplate = function (keyname, tmpl) {
  var nuts = this
  this.compiled = false
  this.promises.push(function (next) {
    parser(tmpl, function (err, parsed) {
      if (err) throw err
      var nut = new Nut(parsed[0], nuts)
      nut.name = keyname
      nuts.items[keyname] = nut
      next()
    })
  })
  return this
}

Nuts.prototype.setTemplates = function (tmpls) {
  var i
  for (i in tmpls) {
    this.setTemplate(i, tmpls[i])
  }
  return this
}

Nuts.prototype.addFile = function (filePath) {
  this.addNuts(fs.readFileSync(filePath, { encoding: 'utf8' }))
  return this
}

Nuts.prototype.addFolder = function (folderPath) {
  var nuts = this
  this.compiled = false
  this.promises.push(function (next) {
    // get all files inside folderPath
    recursive(folderPath, function (error, files) {
      if (!files) { return next()}
      if (error) { return next(error)}
      var limit = files.length
      if (!limit) { return next()}

      var count = newCounter(limit, next)
      // read files
      files.forEach(function (filePath) {
        // exclude no .html files
        if (path.extname(filePath) !== '.html') {
          return count()
        }
        addNuts.call(nuts, fs.readFileSync(filePath, { encoding: 'utf8' }), count)
      })
    })
  })
  return this
}

Nuts.prototype.addFormat = function (keyname, formatter) {
  var nuts = this
  this.compiled = false
  this.promises.push(function (next) {
    nuts.formats[keyname] = formatter
    next()
  })
  return this
}

Nuts.prototype.addFilter = function (keyname, filter) {
  var nuts = this
  this.compiled = false
  this.promises.push(function (next) {
    nuts.filters[keyname] = filter
    next()
  })
  return this
}

Nuts.prototype.addFilters = function (filters) {
  var i

  this.compiled = false

  for (i in filters) {
    this.addFilter(i, filters[i])
  }
  return this
}

Nuts.prototype.render = function (keyname, data, callback) {
  if (!this.compiled) {
    callback('compile before render please')
  }
  var nut = this.items[ keyname ]
  if (nut) {
    return nut.render(data, function (out) {
      callback(null, out)
    })
  }
  callback(null, '')
}

Nuts.prototype.compile = function (callback) {
  callback = callback || function () {}
  this.promises.push(compile)
  var fns = this.promises.slice()
  this.promises = []
  sequence(this, fns, callback)
}

Nuts.prototype.get = function (keyname) {
  return this.items[ keyname ]
}

module.exports = Nuts
