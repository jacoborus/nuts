'use strict'

const test = require('tape')
const Nuts = require('../../src/Nuts.js')

test('render simple tag and text nodes', function (t) {
  let nuts = new Nuts()
  let tmpl = '<span nut="sample">hola</span>'
  nuts
  .addNuts(tmpl)
  .compile(function (err) {
    t.notOk(err)
    nuts.render('sample', {}, function (err, html) {
      t.notOk(err)
      t.is(html, '<span>hola</span>')
      t.end()
    })
  })
})

test('render comment nodes', function (t) {
  let nuts = new Nuts()
  let tmpl = '<span nut="tmplComment"><!--this is a comment--></span>'
  nuts
  .addNuts(tmpl)
  .compile(function (err) {
    t.notOk(err)
    nuts.render('tmplComment', {}, function (err, html) {
      t.notOk(err)
      t.is(html, '<span><!--this is a comment--></span>')
      t.end()
    })
  })
})

test('render CDATA nodes', function (t) {
  let nuts = new Nuts()
  let tmpl = '<span nut="tmplCdata"><![CDATA[ This is a CDATA block ]]></span>'
  nuts
  .addNuts(tmpl)
  .compile(function (err) {
    t.notOk(err)
    nuts.render('tmplCdata', {}, function (err, html) {
      t.notOk(err)
      t.is(html, '<span><![CDATA[ This is a CDATA block ]]></span>')
      t.end()
    })
  })
})

test('render through parent scope', function (t) {
  let nuts = new Nuts()
  let tmpl = '<ul nut="simpleScope"><li>hola</li></ul>'
  nuts
  .addNuts(tmpl)
  .compile(function (err) {
    t.notOk(err)
    nuts.render('simpleScope', {}, function (err, html) {
      t.notOk(err)
      t.is(html, '<ul><li>hola</li></ul>')
      t.end()
    })
  })
})

test('render regular attributes', function (t) {
  let nuts = new Nuts()
  let tmpl = '<span nut="regularAttribs" id="id" other="other"></span>'
  nuts
  .addNuts(tmpl)
  .compile(function (err) {
    t.notOk(err)
    nuts.render('regularAttribs', {}, function (err, html) {
      t.notOk(err)
      t.is(html, '<span id="id" other="other"></span>')
      t.end()
    })
  })
})

test('render simple className', function (t) {
  let nuts = new Nuts()
  let tmpl = '<span nut="simpleClass" class="featured"></span>'
  nuts
  .addNuts(tmpl)
  .compile(function (err) {
    t.notOk(err)
    nuts.render('simpleClass', {}, function (err, html) {
      t.is(html, '<span class="featured"></span>')
      t.notOk(err)
      t.end()
    })
  })
})

test('render doctype', function (t) {
  let nuts = new Nuts()
  let tmpl = '<html nut="doctype" nu-doctype></html>'
  nuts
  .addNuts(tmpl)
  .compile(function (err) {
    t.notOk(err)
    nuts.render('doctype', {}, function (err, html) {
      t.notOk(err)
      t.is(html, '<!DOCTYPE html><html></html>')
      t.end()
    })
  })
})

test('render void elements', function (t) {
  let nuts = new Nuts()
  let tmpl = '<span nut="voidElements">' +
      '<area>' +
      '<base>' +
      '<br>' +
      '<col>' +
      '<embed>' +
      '<hr>' +
      '<img>' +
      '<input>' +
      '<keygen>' +
      '<link>' +
      '<meta>' +
      '<param>' +
      '<source>' +
      '<track>' +
      '<wbr>' +
    '</span>'
  nuts
  .addNuts(tmpl)
  .compile(function (err) {
    t.notOk(err)
    nuts.render('voidElements', {}, function (err, html) {
      t.notOk(err)
      t.is(html, '<span>' +
        '<area>' +
        '<base>' +
        '<br>' +
        '<col>' +
        '<embed>' +
        '<hr>' +
        '<img>' +
        '<input>' +
        '<keygen>' +
        '<link>' +
        '<meta>' +
        '<param>' +
        '<source>' +
        '<track>' +
        '<wbr>' +
      '</span>')
      t.end()
    })
  })
})

test('render SVG elements', function (t) {
  let nuts = new Nuts()
  let tmpl = '<span nut="svgElements">' +
      '<path>' +
      '<circle>' +
      '<ellipse>' +
      '<line>' +
      '<rect>' +
      '<use>' +
      '<stop>' +
      '<polyline>' +
      '<polygone>' +
    '</span>'
  nuts
  .addNuts(tmpl)
  .compile(function (err) {
    t.notOk(err)
    nuts.render('svgElements', {}, function (err, html) {
      t.notOk(err)
      t.is(html, '<span>' +
        '<path>' +
        '<circle>' +
        '<ellipse>' +
        '<line>' +
        '<rect>' +
        '<use>' +
        '<stop>' +
        '<polyline>' +
        '<polygone>' +
      '</span>')
      t.end()
    })
  })
})
