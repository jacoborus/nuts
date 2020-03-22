import test from 'tape'
import { getBox } from 'boxes'
import {
  renderAttEvent,
  renderAttVariable,
  renderAttConstant,
  renderAttPlain
} from '../../src/dom/dom-attrib'

test('DOM: renderAttPlain', t => {
  const elem = document.createElement('span')
  const render = renderAttPlain('uno', 'one')
  const links = render(elem, getBox({}))
  t.is(links.length, 0, 'no links')
  t.is(elem.getAttribute('uno'), 'one', 'adds attrib')
  t.end()
})

test('DOM renderAttConstant', t => {
  const elem = document.createElement('div')
  const render = renderAttConstant('uno', box => `att ${box.a}`)
  const box = getBox({ a: 'one' })
  const links = render(elem, box)
  t.is(links.length, 0, 'no links')
  t.is(elem.getAttribute('uno'), 'att one', 'adds attrib')
  t.end()
})

test('DOM renderAttVariable', t => {
  const elem = document.createElement('div')
  const render = renderAttVariable('uno', box => `att ${box.a} ${box.b.c}`, ['a', 'b.c'])
  const box = getBox({
    a: 'one',
    b: {
      c: 'uno'
    }
  })
  const links = render(elem, box)
  t.is(links.length, 2, 'two links')
  t.is(elem.getAttribute('uno'), 'att one uno', 'adds attrib')
  box.a = 'two'
  t.is(elem.getAttribute('uno'), 'att two uno', 'change attrib')
  box.b.c = 'dos'
  t.is(elem.getAttribute('uno'), 'att two dos', 'change attrib')
  links.forEach(link => link.off())
  box.a = 'three'
  t.is(elem.getAttribute('uno'), 'att two dos', 'off attrib')
  t.end()
})

test('DOM renderAttEvent', t => {
  const elem = document.createElement('div')
  const render = renderAttEvent('click', 'ev')
  const box = getBox({ count: 0 })
  box.ev = () => ++box.count
  const links = render(elem, box)
  elem.click()
  t.is(box.count, 1, 'click 1')
  elem.click()
  t.is(box.count, 2, 'click 2')
  links.forEach(link => link.off())
  elem.click()
  t.is(box.count, 2, 'off')
  t.end()
})
