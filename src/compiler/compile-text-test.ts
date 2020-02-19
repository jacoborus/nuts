import test from 'tape'
import { compileText } from './compile-text'

const baseComp = {
  type: 'text',
  data: ''
}

test('Compile#textFixed empty', t => {
  const compiled = compileText(baseComp)
  t.same(['text', []], compiled)
  t.end()
})

test('Compile#textFixed', t => {
  const schema = Object.assign({}, baseComp, { data: 'hola' })
  const compiled = compileText(schema)
  t.is(compiled.length, 2)
  t.is(compiled[1].length, 1)
  t.same(compiled, ['text', [['textFixed', 'hola']]])
  t.end()
})

test('Compile#textConstant', t => {
  const schema = Object.assign({}, baseComp, { data: '{ hola }' })
  const compiled = compileText(schema)
  t.same(compiled, ['text', [['textConst', 'hola']]])
  t.end()
})

test('Compile#textVar', t => {
  const schema = Object.assign({}, baseComp, { data: '{: hola }' })
  const compiled = compileText(schema)
  t.same(compiled, ['text', [['textVar', 'hola']]])
  t.end()
})

test('Compile#textVar', t => {
  const schema = Object.assign({}, baseComp, { data: 'Fixed { constantino } y {: valentino }' })
  const compiled = compileText(schema)
  t.same(compiled, ['text', [
    ['textFixed', 'Fixed '],
    ['textConst', 'constantino'],
    ['textFixed', ' y '],
    ['textVar', 'valentino']
  ]])
  t.end()
})
