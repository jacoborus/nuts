import test from 'tape'

import { Box } from 'boxes'
import { renderTemplate } from '../../src/dom/dom-template'
import { renderTag } from '../../src/dom/dom-tag'
import {
  renderAttPlain,
  renderAttVariable
} from '../../src/dom/dom-attrib'

function setup (scope: Box) {
  scope.a = 'one'
  scope.b = { c: 'uno' }
}

test('DOM: renderTemplate', t => {
  const target = document.createElement('div')
  document.body.appendChild(target)
  target.setAttribute('id', 'renderTemplate')
  const render = renderTemplate([
    renderTag(
      'span',
      [
        renderAttPlain('uno', 'one'),
        renderAttVariable('dos', box => `att ${box.a} ${box.b.c}`, ['a', 'b.c'])
      ],
      [
        renderTag('span', [], []),
        renderTag('div', [], [])
      ]
    ),
    renderTag('span', [], [])
  ])

  const comp = render(setup)

  comp('#renderTemplate')
  t.is(target.innerHTML, '<span uno="one" dos="att one uno"><span></span><div></div></span><span></span>', 'render tag full')

  t.end()
})
