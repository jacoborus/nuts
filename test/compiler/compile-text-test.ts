import test from 'tape'
import { compileText } from '../../src/compiler/compile-text'

const baseComp = {
  type: 'text',
  data: ''
}

test('Compile#textPlain empty', t => {
  const compiled = compileText(baseComp)
  t.same(['text', []], compiled)
  t.end()
})

test('Compile#textPlain', t => {
  const schema = Object.assign({}, baseComp, { data: 'hola' })
  const compiled = compileText(schema)
  t.is(compiled.length, 2)
  t.is(compiled[1].length, 1)
  t.same(compiled, ['text', [['plain', 'hola']]])
  t.end()
})

test('Compile#textConstant', t => {
  const schema = Object.assign({}, baseComp, { data: '{{ hola }}' })
  const compiled = compileText(schema)
  t.same(compiled, ['text', [['constant', 'hola']]])
  t.end()
})

test('Compile#textVar', t => {
  const schema = Object.assign({}, baseComp, { data: '{{: hola }}' })
  const compiled = compileText(schema)
  t.same(compiled, ['text', [['variable', 'hola']]])
  t.end()
})

test('Compile#textVar', t => {
  const schema = Object.assign({}, baseComp, { data: 'Fixed {{ constantino }} y {{: valentino }}' })
  const compiled = compileText(schema)
  t.same(compiled, ['text', [
    ['plain', 'Fixed '],
    ['constant', 'constantino'],
    ['plain', ' y '],
    ['variable', 'valentino']
  ]])
  t.end()
})
