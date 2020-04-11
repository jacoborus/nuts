import test from 'tape'
import {
  ElemSchema
} from '../../src/common'

import { parseConditional } from '../../src/parser/parse-conditional'

const baseChildren = [
  {
    kind: 'text',
    mode: 'plain',
    literal: 'lit',
    variables: []
  },
  {
    kind: 'tag',
    name: 'span',
    attribs: [{
      kind: 'conditionalConst',
      propName: '(if)',
      value: 'x.y',
      variables: ['x.y']
    }],
    children: []
  },
  {
    kind: 'tag',
    name: 'p',
    attribs: [],
    children: []
  }
]

test('Parse conditional: if-const', t => {
  const [first, second, third] = parseConditional(baseChildren as ElemSchema[])
  const result = {
    kind: 'conditionalConst',
    conditions: ['box => !!box.x?.y'],
    variables: ['x.y'],
    children: [
      {
        kind: 'tag',
        name: 'span',
        attribs: [],
        children: []
      }
    ]
  }
  t.same(first, baseChildren[0])
  t.same(second, result)
  t.same(third, baseChildren[2])
  t.end()
})
