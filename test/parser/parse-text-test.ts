import test from 'tape'
import { parseText } from '../../src/parser/parse-text'

const baseComp = {
  type: 'text',
  data: ''
}

test('Parse#textPlain empty', t => {
  const parsed = parseText(baseComp)
  t.same(['text', []], parsed)
  t.end()
})

test('Parse#textPlain', t => {
  const schema = Object.assign({}, baseComp, { data: 'hola' })
  const parsed = parseText(schema)
  t.is(parsed.length, 2)
  t.is(parsed[1].length, 1)
  t.same(parsed, ['text', [['plain', 'hola']]])
  t.end()
})

test('Parse#textConstant', t => {
  const schema = Object.assign({}, baseComp, { data: '{{ hola }}' })
  const parsed = parseText(schema)
  t.same(parsed, ['text', [['constant', 'hola']]])
  t.end()
})

test('Parse#textVar', t => {
  const schema = Object.assign({}, baseComp, { data: '{{: hola }}' })
  const parsed = parseText(schema)
  t.same(parsed, ['text', [['variable', 'hola']]])
  t.end()
})

test('Parse#textVar', t => {
  const schema = Object.assign({}, baseComp, { data: 'Fixed {{ constantino }} y {{: valentino }}' })
  const parsed = parseText(schema)
  t.same(parsed, ['text', [
    ['plain', 'Fixed '],
    ['constant', 'constantino'],
    ['plain', ' y '],
    ['variable', 'valentino']
  ]])
  t.end()
})
