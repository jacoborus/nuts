import test from 'tape'
import { compileTemplate } from '../../src/compiler/compile-template'

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
    [kind1, name, attribs, children],
    [kind2, [[kind3, value]]]
  ]] = compileTemplate(baseComp)
  t.is(kind, 'template', 'template type')
  t.is(kind1, 'tag', 'tag type')
  t.is(name, 'tagname', 'tag name')
  t.same(attribs, [['plain', 'id', 'myid']], 'attribs')
  t.notOk(children.length, 'no children')

  t.is(kind2, 'text', 'text content type')
  t.is(kind3, 'textFixed', 'value')
  t.is(value, 'hola', 'value')

  t.end()
})
