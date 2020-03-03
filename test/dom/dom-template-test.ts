import test from 'tape'

import { Box } from '../../src/dom/dom-common'
import { renderTemplate } from '../../src/dom/dom-template'
import { renderTag } from '../../src/dom/dom-tag'
import {
  renderAttPlain,
  renderAttVariable
} from '../../src/dom/dom-attrib'

function setup (scope: Box) {
  scope.varname = 'two'
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
        renderAttVariable('dos', 'varname')
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
  t.is(target.innerHTML, '<span uno="one" dos="two"><span></span><div></div></span><span></span>', 'render tag full')

  t.end()
})
