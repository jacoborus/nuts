'use strict'

const Nut = require('./Nut.js'),
      parser = require('./parser.js'),
      recursive = require('recursive-readdir'),
      fs = require('fs'),
      path = require('path'),
      newCounter = require('./loop.js').newCounter,
      sequence = require('./loop.js').sequence

// TODO: rethink this
const readyForGetSchema = function (item) {
  let templates = item.nuts.templates,
      partials = item.partials

  // check if a template has partial and its schema ready
  if (item.partial && !templates[ item.partial ].schema) {
    return true
  }

  // check if any partial of the tag has not its schema ready
  return partials ? !partials.some(partial => !templates[partial].schema) : true
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
    this.formatters = {}
    this.filters = {}
    this.promises = []
    this.errors = []
    this.templates = {}
  }

  /**
   * Add a new promise in the stack
   *
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

  /**
   * Run all promises and then the callback. exec method does not compile templates
   *
   * @param {function} callback actions to do after promises
   */
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
    this.promises.push(next => addNuts.call(this, html, next))
    return this
  }

  /**
   * Add template from given string to templates archive with defined keyname
   *
   * @param {string} keyname tag nutName
   * @param {string} tmpl html tag
   * @return {object} nuts
   */
  setTemplate (keyname, tmpl) {
    let nuts = this
    this.compiled = false
    this.promises.push(next => {
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

  /**
   * Add templates from object to templates archive
   *
   * Example:
   *
   * ```
   * nuts.setTemplates({
   *   'aTemplateName': '<span>a single template</span>',
   *   'otherTemplateName': '<span>other template</span>'
   * })
   * ```
   *
   * @param {object} tmpls dictionary with nut names as keynames and html templates as values
   * @return {object} nuts
   */
  setTemplates (tmpls) {
    for (let i in tmpls) {
      this.setTemplate(i, tmpls[i])
    }
    return this
  }

  /**
   * Add file with templates to templates archive
   *
   * ```
   * nuts.addFile('path/to/file.html')
   * ```
   *
   * @param {string} filePath relative route to file with templates
   * @return {object} nuts
   */
  addFile (filePath) {
    return this.addNuts(fs.readFileSync(filePath, { encoding: 'utf8' }))
  }

  /**
   * addFolder
   *
   * Add all templates from files within a folder
   *
   * ```
   * nuts.addFile('path/to/file.html')
   * ```
   *
   * @param {string} folderPath path to folder containing nuts template files
   * @return {object} nuts
   */
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

  /**
   * Assign a formatter to formatters archive
   *
   * ```
   * nuts.addFormat('meters', (input) => input + ' meters')
   * ```
   * @param {string} keyname name of the formatter
   * @param {function} formatter
   * @return {object} nuts
   */
  addFormat (keyname, formatter) {
    this.compiled = false
    this.promises.push(next => {
      this.formatters[keyname] = formatter
      next()
    })
    return this
  }

  /**
   * Assign a filter to a nut template
   *
   * @param {string} keyname nut template name
   * @param {} formatter
   */
  addFilter (keyname, filter) {
    this.compiled = false
    this.promises.push(next => {
      this.filters[keyname] = filter
      next()
    })
    return this
  }

  /**
   * Assing filters to nut templates
   * For more info see [filters]()
   *
   * ```
   * nuts.addFilters({
   *   aTemplateName: aFilter,
   *   otherTemplatename: otherFilter
   * })
   * ```
   *
   * @param {object} filters dictionary with template names as keys and filters as values
   * @return {object} nuts
   */
  addFilters (filters) {
    this.compiled = false

    for (let i in filters) {
      this.addFilter(i, filters[i])
    }
    return this
  }

  /**
   * Render a template
   *
   * @param {string} keyname name of template for rendering
   * @param {object} data context
   * @param {function} callback signature: err, renderedTemplate
   */
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

  /**
   * Compile all the nuts template objects.
   *
   * @param {function} callback signature: err
   */
  compile (callback) {
    callback = callback || function () {}
    this.promises.push(function (next) {
      let keys = Object.keys(this.templates)

      // make all schemas of nuts
      while (keys.length) {
        keys.forEach(() => {
          let key = keys.shift(),
              item = this.templates[key]

          if (readyForGetSchema(item)) {
            // generate schema
            item.schema = item.getSchema()
            // optimize for compilation
            item.precompiled = item.getPrecompiled()
          } else {
            keys.push(key)
          }
        }, this)
      }

      // compile all optimized schemas
      for (let i in this.items) {
        this.items[i].render = this.items[i].getRender()
      }
      this.compiled = true
      next()
    })
    let fns = this.promises.slice()
    this.promises = []
    sequence(this, fns, callback)
  }

  /**
   * Get a nut template object
   *
   * @param {string} keyname name of a template
   * @return {object} nut template object
   */
  get (keyname) {
    return this.items[ keyname ]
  }
}

module.exports = Nuts
