import test from 'tape'
import { compileTemplate } from '../../src/compiler/compile-template'
import { TagSchema } from '../../src/common'

const baseComp = [{
  type: 'tag',
  name: 'tagname',
  attribs: {
    id: 'myid'
  },
  children: []
},
{
  type: 'text',
  data: 'hola'
}]

test('Compile#template', t => {
  // TODO: clean this mess
  const [kind, [
    child1,
    [kind2, [[kind3, value]]]
  ]] = compileTemplate(baseComp)

  const [kind1, name, attribs, children] = child1 as TagSchema
  t.is(kind, 'template', 'template type')

  t.is(kind1, 'tag', 'tag type')
  t.is(name, 'tagname', 'tag name')
  t.same(attribs, [['plain', 'id', 'myid']], 'attribs')
  t.notOk(children.length, 'no children')

  t.is(kind2, 'text', 'text content type')
  t.is(kind3, 'plain', 'value')
  t.is(value, 'hola', 'value')

  t.end()
})
