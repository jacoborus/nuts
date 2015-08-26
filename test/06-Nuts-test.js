'use strict'

var expect = require('chai').expect,
  Nuts = require('../src/Nuts.js')

describe('API', function () {
  describe('addNuts', function () {
    var nuts = new Nuts()
    it('store nuts from html into nuts archive', function (done) {
      var tmpl = '<span nut="add1"></span><span nut="add2"></span>'
      nuts
      .addNuts(tmpl)
      .exec(function (err) {
        expect(err).to.not.be.ok
        expect(nuts.getNut('add1').nutName).to.equal('add1')
        expect(nuts.getNut('add2').nutName).to.equal('add2')
        done()
      })
    })
    it('send errors to Nuts.errors', function (done) {
      var tmpl = '<span></span>'
      nuts
      .addNuts(tmpl)
      .exec(function (err) {
        expect(err).to.be.ok
        done()
      })
    })
  })

  describe('setTemplate', function () {
    var nuts = new Nuts()
    it('add a nut into nuts archive with passed keyname', function (done) {
      var tmpl = '<span></span>'
      nuts
      .setTemplate('set1', tmpl)
      .setTemplate('set2', tmpl)
      .exec(function () {
        expect(nuts.getNut('set1').name).to.equal('set1')
        expect(nuts.getNut('set2').name).to.equal('set2')
        done()
      })
    })
  })

  describe('setTemplates', function () {
    var nuts = new Nuts()
    it('add nuts into nuts archive with passed keynames', function (done) {
      var tmpl = '<span></span>'
      nuts
      .setTemplates({ set1: tmpl, set2: tmpl })
      .exec(function (err) {
        expect(err).to.not.be.ok
        expect(nuts.getNut('set1').name).to.equal('set1')
        expect(nuts.getNut('set2').name).to.equal('set2')
        done()
      })
    })
  })

  describe('addFile', function () {
    it('add nuts from file', function (done) {
      var nuts = new Nuts()
      nuts
      .addFile(__dirname + '/assets/basic.html')
      .addFile(__dirname + '/assets/basic2.html')
      .exec(function (err) {
        expect(err).to.not.be.ok
        expect(nuts.getNut('basic1').nutName).to.equal('basic1')
        expect(nuts.getNut('basic2').nutName).to.equal('basic2')
        expect(nuts.getNut('basic3').nutName).to.equal('basic3')
        done()
      })
    })
  })

  describe('addFolder', function () {
    it('add nuts from files in folder (recursive)', function (done) {
      var nuts = new Nuts()
      nuts
      .addFolder(__dirname + '/assets/folder')
      .exec(function (err) {
        expect(err).to.not.be.ok
        expect(nuts.getNut('basic1').nutName).to.equal('basic1')
        expect(nuts.getNut('basic2').nutName).to.equal('basic2')
        expect(nuts.getNut('basic3').nutName).to.equal('basic3')
        expect(nuts.getNut('basic4').nutName).to.equal('basic4')
        done()
      })
    })
  })

  describe('addFormat', function () {
    it('add formats to Nuts', function (done) {
      var nuts = new Nuts()
      nuts
      .addFormat('€', function (val) {
        return val + '€'
      })
      .exec(function (err) {
        expect(err).to.not.be.ok
        expect(nuts.formats['€']).to.be.a('function')
        done()
      })
    })
  })

  describe('addFilter', function () {
    it('add filters to Nuts', function (done) {
      var nuts = new Nuts()
      nuts
      .addFilter('myFilter', function (val) {
        return val + '€'
      })
      .exec(function (err) {
        expect(err).to.not.be.ok
        expect(nuts.filters['myFilter']).to.be.a('function')
        done()
      })
    })

    it('add multiple filters', function (done) {
      var nuts = new Nuts()
      nuts.addFilters({
        multiFilter1: {
          word: function (field, scope) {
            return 'get ' + field + '!'
          }
        },
        multiFilter2: {
          word: function (field, scope) {
            return 'get ' + field + '!'
          }
        }
      })
      .exec(function (err) {
        expect(err).to.not.be.ok
        expect(nuts.filters['multiFilter1']).to.be.a('object')
        expect(nuts.filters['multiFilter2']).to.be.a('object')
        done()
      })
    })
  })
})
