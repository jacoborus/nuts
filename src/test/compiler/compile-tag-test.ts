import test from 'tape'
import { compileTag } from '../../compiler/compile-tag'

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

test('Compile#tag', t => {
  const [kind, name, attribs, children] = compileTag(baseComp)
  t.is(kind, 'tag')
  t.is(name, 'tagname')
  t.same(attribs, [['plain', 'id', 'myid']])
  t.is(children[0][0], 'text')
  t.end()
})
