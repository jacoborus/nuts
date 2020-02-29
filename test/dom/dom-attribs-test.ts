import test from 'tape'
import { getBox } from 'boxes'
import {
  // renderTextContent,
  renderTextVariable,
  renderTextConstant,
  renderTextPlain
} from '../../src/dom/dom-text'

test('DOM: renderTextPlain', t => {
  const str = 'Hello nuts'
  const render = renderTextPlain(str)
  const comp = render({})
  t.is(comp.elem.textContent, str, 'render ok')
  t.end()
})

test('DOM: renderTextConstant', t => {
  const braces = 'myvar'
  const render = renderTextConstant(braces)
  const str = 'Hello nuts'
  const comp = render({ myvar: str })
  t.is(comp.elem.textContent, str, 'render ok')
  t.end()
})

test('DOM: renderVariable', t => {
  const braces = 'myvar'
  const render = renderTextVariable(braces)
  const str = 'Hello nuts'
  const box = getBox({ myvar: str })
  const comp = render(box)
  t.is(comp.elem.textContent, str, 'render')
  box.myvar = 'a'
  t.is(comp.elem.textContent, 'a', 'change value')
  comp.links[0].off()
  box.myvar = 'b'
  t.is(comp.elem.textContent, 'a', 'link.off')
  t.end()
})

// test('DOM: renderTextContent', t => {
//   const fns = [
//   ]
//   t.fail()
//   t.end()
// })
