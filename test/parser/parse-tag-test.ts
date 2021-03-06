import test from 'tape'
import { parseTag } from '../../src/parser/parse-tag'

const baseComp = {
  type: 'tag',
  name: 'span',
  attribs: { id: 'myid' },
  children: [
    {
      type: 'text',
      data: 'hola'
    },
    {
      type: 'tag',
      name: 'my-comp',
      attribs: {},
      children: []
    }
  ]
}

test('Parse tag: simple', t => {
  const { kind, name, attribs, children } = parseTag(baseComp)
  t.is(kind, 'tag')
  t.is(name, 'span')
  t.same(attribs, [{
    kind: 'plain',
    propName: 'id',
    value: 'myid',
    variables: []
  }])
  t.is(children[0].kind, 'text')
  t.is(children[1].kind, 'nut')
  t.end()
})

test.skip('Parse tag: with conditional const', t => {
  const condComp = {
    type: 'tag',
    name: 'span',
    attribs: { '(if)': 'mycond' },
    children: [
      {
        type: 'text',
        data: 'hola'
      }
    ]
  }

  const { kind, name, attribs, children } = parseTag(condComp)
  t.is(kind, 'tag')
  t.is(name, 'span')
  t.same(attribs, [{
    kind: 'plain',
    propName: 'id',
    value: 'myid',
    variables: []
  }])
  t.is(children[0].kind, 'text')
  t.is(children[1].kind, 'nut')
  t.end()
})
