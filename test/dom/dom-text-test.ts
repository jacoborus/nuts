import test from 'tape'
import { getBox } from 'boxes'
import {
  renderTextVariable,
  renderTextConstant,
  renderTextPlain
} from '../../src/dom/dom-text'

type Box = { [index: string]: any }

test('DOM: renderTextPlain', t => {
  const str = 'Hello nuts'
  const render = renderTextPlain(str)
  const comp = render({})
  t.is(comp.elem.textContent, str, 'render ok')
  t.end()
})

test('DOM: renderTextConstant', t => {
  const scope = {
    w: 'World'
  }
  const str = 'Hello World!'
  const render = renderTextConstant(box => `Hello ${box.w}!`)
  const comp = render(scope)
  t.is(comp.elem.textContent, str, 'render ok')
  t.end()
})

test('DOM: renderVariable', t => {
  const scope = getBox({
    w: 'World'
  })
  const str = 'Hello World!'
  const str2 = 'Hello Mundo!'
  const render = renderTextVariable((box: Box) => `Hello ${box.w}!`, ['w'])
  const comp = render(scope)
  t.is(comp.elem.textContent, str, 'render ok')
  scope.w = 'Mundo'
  t.is(comp.elem.textContent, str2, 'change value')
  comp.links[0].off()
  scope.w = 'Mars'
  t.is(comp.elem.textContent, str2, 'link.off')
  t.end()
})
