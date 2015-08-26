'use strict'

const Nut = require('./Nut.js'),
      parser = require('./parser.js'),
      recursive = require('recursive-readdir'),
      fs = require('fs'),
      path = require('path'),
      newCounter = require('./loop.js').newCounter,
      sequence = require('./loop.js').sequence

const hasSchemas = function (item) {
  let templates = item.nuts.templates,
      partials = item.partials

  if (item.partial && !templates[ item.partial ].schema) {
    return false
  }

  for (let i in partials) {
    if (!templates[ partials[ i ]].schema) {
      return false
    }
  }
  return true
}

const makeSchemas = function (list, items, callback) {
  list.forEach(function () {
    let key = list.shift(),
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

const compile = function (next) {
  let keys = Object.keys(this.templates),
      nut = this,
      len = keys.length

  if (!len) {
    return next()
  }

  makeSchemas(keys, this.templates, function () {
    for (let i in nut.items) {
      nut.items[i].precompiled = nut.items[i].getPrecompiled()
    }

    for (let i in nut.items) {
      nut.items[i].render = nut.items[i].getRender()
    }
    nut.compiled = true
    next()
  })
}

/*!
 * Add templates to archive
 * @param {String}   html text with nuts
 * @param {Function} next launch next function in the stack
 */
const addNuts = function (html, next) {
  let nuts = this
  this.compiled = false

  parser(html, function (err, parsed) {
    if (err) {
      return nuts.errors.push(err)
    }
    if (!parsed.length) {
      return next()
    }
    let count = newCounter(parsed.length, next)
    parsed.forEach(function (parsedNut) {
      if (parsedNut.type === 'text' && parsedNut.data.trim() === '') {
        return count()
      }
      let nut = new Nut(parsedNut, nuts)
      if (!nut.nutName) {
        return next('Nuts templates requires nut attribute')
      }
      nuts.items[ nut.nutName ] = nut
      count()
    })
  })

  return this
}

// nuts constructor
class Nuts {
  constructor () {
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
  then (fn) {
    if (typeof fn !== 'function') {
      this.errors.push('nuts.then requires a function as param')
      return this
    }
    this.promises.push(fn)
    return this
  }

  exec (callback) {
    callback = callback || function () {}
    let fns = this.promises.slice()
    this.promises = []
    sequence(this, fns, callback)
  }

  getNut (keyname) {
    return this.items[keyname]
  }

  addNuts (html) {
    let nuts = this
    this.promises.push(next => addNuts.call(nuts, html, next))
    return this
  }

  setTemplate (keyname, tmpl) {
    let nuts = this
    this.compiled = false
    this.promises.push(function (next) {
      parser(tmpl, function (err, parsed) {
        if (err) throw err
        let nut = new Nut(parsed[0], nuts)
        nut.name = keyname
        nuts.items[keyname] = nut
        next()
      })
    })
    return this
  }

  setTemplates (tmpls) {
    for (let i in tmpls) {
      this.setTemplate(i, tmpls[i])
    }
    return this
  }

  addFile (filePath) {
    this.addNuts(fs.readFileSync(filePath, { encoding: 'utf8' }))
    return this
  }

  addFolder (folderPath) {
    let nuts = this
    this.compiled = false
    this.promises.push(function (next) {
      // get all files inside folderPath
      recursive(folderPath, function (error, files) {
        if (!files) { return next()}
        if (error) { return next(error)}
        let limit = files.length
        if (!limit) { return next()}

        let count = newCounter(limit, next)
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

  addFormat (keyname, formatter) {
    let nuts = this
    this.compiled = false
    this.promises.push(next => {
      nuts.formats[keyname] = formatter
      next()
    })
    return this
  }

  addFilter (keyname, filter) {
    let nuts = this
    this.compiled = false
    this.promises.push(function (next) {
      nuts.filters[keyname] = filter
      next()
    })
    return this
  }

  addFilters (filters) {
    this.compiled = false

    for (let i in filters) {
      this.addFilter(i, filters[i])
    }
    return this
  }

  render (keyname, data, callback) {
    if (!this.compiled) {
      callback('compile before render please')
    }
    let nut = this.items[ keyname ]
    if (nut) {
      return nut.render(data, function (out) {
        callback(null, out)
      })
    }
    callback(null, '')
  }

  compile (callback) {
    callback = callback || function () {}
    this.promises.push(compile)
    let fns = this.promises.slice()
    this.promises = []
    sequence(this, fns, callback)
  }

  get (keyname) {
    return this.items[ keyname ]
  }
}

module.exports = Nuts
