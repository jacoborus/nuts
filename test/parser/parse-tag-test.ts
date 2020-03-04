import test from 'tape'
import { parseTag } from '../../src/parser/parse-tag'

const baseComp = {
  type: 'tag',
  name: 'tagname',
  attribs: {
    id: 'myid'
  },
  children: [
    {
      type: 'text',
      data: 'hola'
    }
  ]
}

test('Parse#tag', t => {
  const [kind, name, attribs, children] = parseTag(baseComp)
  t.is(kind, 'tag')
  t.is(name, 'tagname')
  t.same(attribs, [['plain', 'id', 'myid']])
  t.is(children[0][0], 'text')
  t.end()
})
