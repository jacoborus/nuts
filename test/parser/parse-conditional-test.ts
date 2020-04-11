import test from 'tape'
import {
  ElemSchema
} from '../../src/common'

import { parseConditional } from '../../src/parser/parse-conditional'

const baseChildren = [
  {
    kind: 'text',
    mode: 'plain',
    literal: 'lit',
    variables: []
  },
  {
    kind: 'tag',
    name: 'span',
    attribs: [{
      kind: 'conditionalConst',
      propName: '(if)',
      value: 'x.y',
      variables: ['x.y']
    }],
    children: []
  },
  {
    kind: 'tag',
    name: 'p',
    attribs: [],
    children: []
  }
]

test('Parse conditional: if-const', t => {
  const [first, second, third] = parseConditional(baseChildren as ElemSchema[])
  const result = {
    kind: 'conditionalConst',
    conditions: ['box => !!box.x?.y'],
    variables: ['x.y'],
    children: [
      {
        kind: 'tag',
        name: 'span',
        attribs: [],
        children: []
      }
    ]
  }
  t.same(first, baseChildren[0])
  t.same(second, result)
  t.same(third, baseChildren[2])
  t.end()
})

test('Parse conditional: if-else-const', t => {
  const elseTag = {
    kind: 'tag',
    name: 'div',
    attribs: [{
      kind: 'conditionalConst',
      propName: '(else)',
      value: '',
      variables: []
    }],
    children: []
  }
  const base = baseChildren.slice()
  base.splice(2, 0, elseTag)
  const [first, second, third] = parseConditional(base as ElemSchema[])
  const result = {
    kind: 'conditionalConst',
    conditions: ['box => !!box.x?.y'],
    variables: ['x.y'],
    children: [
      {
        kind: 'tag',
        name: 'span',
        attribs: [],
        children: []
      },
      {
        kind: 'tag',
        name: 'div',
        attribs: [],
        children: []
      }
    ]
  }
  t.same(first, baseChildren[0])
  t.same(second, result)
  t.same(third, baseChildren[2])
  t.end()
})

test('Parse conditional: if-var', t => {
  const iftag = {
    kind: 'tag',
    name: 'span',
    attribs: [{
      kind: 'conditionalVar',
      propName: '(if)',
      value: ': x.y',
      variables: ['x.y']
    }],
    children: []
  }
  const base = baseChildren.slice()
  base.splice(1, 1, iftag)
  const [first, second, third] = parseConditional(base as ElemSchema[])
  const result = {
    kind: 'conditionalVar',
    conditions: ['box => !!box.x?.y'],
    variables: ['x.y'],
    children: [
      {
        kind: 'tag',
        name: 'span',
        attribs: [],
        children: []
      }
    ]
  }
  t.same(first, baseChildren[0])
  t.same(second, result)
  t.same(third, baseChildren[2])
  t.end()
})

test('Parse conditional: if-else-var', t => {
  const ifTag = {
    kind: 'tag',
    name: 'span',
    attribs: [{
      kind: 'conditionalVar',
      propName: '(if)',
      value: ': x.y',
      variables: ['x.y']
    }],
    children: []
  }
  const elseTag = {
    kind: 'tag',
    name: 'div',
    attribs: [{
      kind: 'conditionalConst',
      propName: '(else)',
      value: '',
      variables: []
    }],
    children: []
  }
  const base = baseChildren.slice()
  base.splice(1, 1, ifTag, elseTag)
  const [first, second, third] = parseConditional(base as ElemSchema[])
  const result = {
    kind: 'conditionalVar',
    conditions: ['box => !!box.x?.y'],
    variables: ['x.y'],
    children: [
      {
        kind: 'tag',
        name: 'span',
        attribs: [],
        children: []
      },
      {
        kind: 'tag',
        name: 'div',
        attribs: [],
        children: []
      }
    ]
  }
  t.same(first, baseChildren[0], 'pre')
  t.same(second, result, 'main')
  t.same(third, baseChildren[2], 'post')
  t.end()
})
