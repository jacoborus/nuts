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
  t.same(['plain', 'id', 'myId'], id)
  t.same(['plain', 'class', 'myClass'], className)
  t.same(['plain', 'other', 'otherAtt'], other)
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
  t.same(['constant', 'id', 'myId'], id)
  t.same(['constant', 'class', 'myClass'], className)
  t.same(['plain', 'other', 'otherAtt'], other)
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
  t.same(['variable', 'id', 'myId'], id)
  t.same(['variable', 'class', 'myClass'], className)
  t.same(['plain', 'other', 'otherAtt'], other)
  t.end()
})
