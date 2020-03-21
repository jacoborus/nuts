import test from 'tape'
import {
  AttSchema
} from '../../src/common'

import {
  buildAttPlain,
  buildAttConstant,
  buildAttVariable,
  buildAttEvent,
  buildAttBoolConst,
  buildAttBoolVar
} from '../../src/builder/build-attribs'

// test('Build attribs', t => {
//   const atts: AttSchema[] = [
//     { kind: 'plain', propName: 'p1', value: 'p2', variables: [] },
//     { kind: 'constant', propName: 'c1', value: 'c2', variables: [] },
//     { kind: 'variable', propName: 'v1', value: 'v2', variables: [] },
//     { kind: 'event', propName: 'e1', value: 'e2', variables: [] },
//     { kind: 'booleanConst', propName: 'checked', value: 'checkconst', variables: [] },
//     { kind: 'booleanVar', propName: 'chevar', value: 'checkvar', variables: [] }
//   ]
//   const result = "renderAttPlain('p1','p2'),renderAttConstant('c1','c2'),renderAttVariable('v1','v2'),renderAttEvent('e1','e2')"
//   const built = buildAttribs(atts)
//   t.is(built, result)
//   t.end()
// })

test('Build attribs: plain', t => {
  const schema = {
    kind: 'plain',
    propName: 'testname',
    value: 'testvalue',
    variables: []
  }
  const result = "renderAttPlain('testname','testvalue')"
  const built = buildAttPlain(schema as AttSchema)
  t.is(built, result)
  t.end()
})

test('Build attribs: constant', t => {
  const schema = {
    kind: 'constant',
    propName: 'testname',
    value: "${box.test?.value ?? ''}",
    variables: []
  }
  const result = "renderAttConstant('testname',box => `${box.test?.value ?? ''}`)"
  const built = buildAttConstant(schema as AttSchema)
  t.is(built, result)
  t.end()
})

test('Build attribs: variable', t => {
  const schema = {
    kind: 'variable',
    propName: 'testname',
    value: 'testvalue',
    variables: ['t1', 't2']
  }
  const result = "renderAttVariable('testname',box => `testvalue`, ['t1','t2'])"
  const built = buildAttVariable(schema as AttSchema)
  t.is(built, result)
  t.end()
})

test('Build attribs: event', t => {
  const schema = {
    kind: 'event',
    propName: 'testname',
    value: 'testvalue',
    variables: []
  }
  const result = "renderAttEvent('testname','testvalue')"
  const built = buildAttEvent(schema as AttSchema)
  t.is(built, result)
  t.end()
})

test('Build attribs: boolean constant', t => {
  const schema = {
    kind: 'booleanConst',
    propName: 'testname',
    value: 'testvalue',
    variables: []
  }
  const result = "renderAttBoolConst('testname','testvalue')"
  const built = buildAttBoolConst(schema as AttSchema)
  t.is(built, result)
  t.end()
})

test('Build attribs: boolean variable', t => {
  const schema = {
    kind: 'booleanVar',
    propName: 'testname',
    value: 'test.value',
    variables: ['test', 'value']
  }
  const result = "renderAttBoolVar('testname','test.value', ['test','value'])"
  const built = buildAttBoolVar(schema as AttSchema)
  t.is(built, result)
  t.end()
})
