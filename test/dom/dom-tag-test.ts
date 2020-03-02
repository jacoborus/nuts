import test from 'tape'
import { getBox } from 'boxes'
import { renderTag } from '../../src/dom/dom-tag'
import {
  renderAttPlain,
  renderAttVariable
} from '../../src/dom/dom-attrib'

test('DOM: renderTag', t => {
  const render = renderTag(
    'span',
    [
      renderAttPlain('uno', 'one'),
      renderAttVariable('dos', 'varname')
    ],
    [
      renderTag('span', [], []),
      renderTag('div', [], [])
    ]
  )
  const box = getBox({ varname: 'two' })
  const comp = render(box)

  t.is(comp.elem.tagName, 'SPAN', 'render tag name')
  t.is(comp.elem.outerHTML, '<span uno="one" dos="two"><span></span><div></div></span>', 'render tag full')

  box.varname = 'hola'
  t.is(comp.elem.outerHTML, '<span uno="one" dos="hola"><span></span><div></div></span>', 'change attribute')

  comp.links.forEach(link => link.off())
  box.varname = 'adios'
  t.is(comp.elem.outerHTML, '<span uno="one" dos="hola"><span></span><div></div></span>', 'off attribute')
  t.end()
})
