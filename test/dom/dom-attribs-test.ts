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
  const links = render(elem, {})
  t.is(links.length, 0, 'no links')
  t.is(elem.getAttribute('uno'), 'one', 'adds attrib')
  t.end()
})

test('DOM renderAttConstant', t => {
  const elem = document.createElement('div')
  const render = renderAttConstant('uno', 'varname')
  const box = getBox({ varname: 'one' })
  const links = render(elem, box)
  t.is(links.length, 0, 'no links')
  t.is(elem.getAttribute('uno'), 'one', 'adds attrib')
  t.end()
})

test('DOM renderAttVariable', t => {
  const elem = document.createElement('div')
  const render = renderAttVariable('uno', 'varname')
  const box = getBox({ varname: 'one' })
  const links = render(elem, box)
  t.is(links.length, 1, 'one link')
  t.is(elem.getAttribute('uno'), 'one', 'adds attrib')
  box.varname = 'two'
  t.is(elem.getAttribute('uno'), 'two', 'change attrib')
  links.forEach(link => link.off())
  box.varname = 'three'
  t.is(elem.getAttribute('uno'), 'two', 'off attrib')
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
