import test from 'tape'
import { compileTextContent } from './compile-text'

const baseComp = {
  type: 'text',
  data: ''
}

test('Compile#textFixed empty', t => {
  const compiled = compileTextContent(baseComp)
  t.same([], compiled)
  t.end()
})

test('Compile#textFixed', t => {
  const schema = Object.assign({}, baseComp, { data: 'hola' })
  const compiled = compileTextContent(schema)
  t.is(compiled.length, 1)
  const [item] = compiled
  t.same(['textFixed', 'hola'], item)
  t.end()
})

test('Compile#textConstant', t => {
  const schema = Object.assign({}, baseComp, { data: '{ hola }' })
  const compiled = compileTextContent(schema)
  t.is(compiled.length, 1)
  const [item] = compiled
  t.same(['textConst', 'hola'], item)
  t.end()
})

test('Compile#textVar', t => {
  const schema = Object.assign({}, baseComp, { data: '{: hola }' })
  const compiled = compileTextContent(schema)
  t.is(compiled.length, 1)
  const [item] = compiled
  t.same(['textVar', 'hola'], item)
  t.end()
})
