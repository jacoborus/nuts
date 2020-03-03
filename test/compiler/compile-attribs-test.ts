import test from 'tape'
import { compileAttribs } from '../../src/compiler/compile-attribs'

const baseComp = {
  type: 'tag',
  name: 'tagname',
  attribs: {},
  children: []
}

test('Compile#attribs', t => {
  const compiled = compileAttribs(baseComp)
  t.same([], compiled)
  t.end()
})

test('CompileAttFixed', t => {
  const schema = Object.assign({}, baseComp, {
    attribs: {
      id: 'myId',
      class: 'myClass',
      other: 'otherAtt'
    }
  })
  const compiled = compileAttribs(schema)
  t.is(compiled.length, 3)
  const [id, className, other] = compiled
  t.same(['plain', 'id', 'myId'], id)
  t.same(['plain', 'class', 'myClass'], className)
  t.same(['plain', 'other', 'otherAtt'], other)
  t.end()
})

test('CompileAttConstant', t => {
  const schema = Object.assign({}, baseComp, {
    attribs: {
      id: '{ myId }',
      class: '{ myClass    }',
      other: 'otherAtt'
    }
  })
  const compiled = compileAttribs(schema)
  t.is(compiled.length, 3)
  const [id, className, other] = compiled
  t.same(['constant', 'id', 'myId'], id)
  t.same(['constant', 'class', 'myClass'], className)
  t.same(['plain', 'other', 'otherAtt'], other)
  t.end()
})

test('CompileAttVariable', t => {
  const schema = Object.assign({}, baseComp, {
    attribs: {
      id: '{: myId }',
      class: '{: myClass    }',
      other: 'otherAtt'
    }
  })
  const compiled = compileAttribs(schema)
  t.is(compiled.length, 3)
  const [id, className, other] = compiled
  t.same(['variable', 'id', 'myId'], id)
  t.same(['variable', 'class', 'myClass'], className)
  t.same(['plain', 'other', 'otherAtt'], other)
  t.end()
})

test('CompileAttEvent', t => {
  const schema = Object.assign({}, baseComp, {
    attribs: {
      '@click': 'clicked',
      '@dblclick': 'doubleclicked'
    }
  })
  const compiled = compileAttribs(schema)
  t.is(compiled.length, 2)
  const [single, double] = compiled
  t.same(single, ['event', 'click', 'clicked'])
  t.same(double, ['event', 'dblclick', 'doubleclicked'])
  t.end()
})
