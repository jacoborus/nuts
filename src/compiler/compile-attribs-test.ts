import test from 'tape'
import { compileAttribs } from './compile-attribs'

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

test('Compile#textFixed', t => {
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
  t.same(['attPlain', 'id', 'myId'], id)
  t.same(['attPlain', 'class', 'myClass'], className)
  t.same(['attPlain', 'other', 'otherAtt'], other)
  t.end()
})

test('Compile#textFixed', t => {
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
  t.same(['attConst', 'id', 'myId'], id)
  t.same(['attConst', 'class', 'myClass'], className)
  t.same(['attPlain', 'other', 'otherAtt'], other)
  t.end()
})

test('Compile#textFixed', t => {
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
  t.same(['attVar', 'id', 'myId'], id)
  t.same(['attVar', 'class', 'myClass'], className)
  t.same(['attPlain', 'other', 'otherAtt'], other)
  t.end()
})
