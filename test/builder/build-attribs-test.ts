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
  const result = "renderAttVariable('testname',box => `testvalue`,['t1','t2'])"
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
  const result = "renderAttBoolVar('testname','test.value',['test','value'])"
  const built = buildAttBoolVar(schema as AttSchema)
  t.is(built, result)
  t.end()
})
