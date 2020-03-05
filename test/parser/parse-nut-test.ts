import test from 'tape'
import { parseNut } from '../../src/parser/parse-nut'

const baseComp = {
  type: 'tag',
  name: 'mynut',
  attribs: {
    id: 'myid'
  },
  children: []
}

test('Parse#nut', t => {
  const [kind, name, attribs] = parseNut(baseComp)
  t.is(kind, 'nut')
  t.is(name, 'mynut')
  t.same(attribs, [['plain', 'id', 'myid']])
  t.end()
})
