import test from 'tape'
import { parseAttribs } from '../../src/parser/parse-attribs'

const baseComp = {
  type: 'tag',
  name: 'tagname',
  attribs: {},
  children: []
}

test('Parse#attribs', t => {
  const parsed = parseAttribs(baseComp)
  t.same([], parsed)
  t.end()
})

test('ParseAttFixed', t => {
  const schema = Object.assign({}, baseComp, {
    attribs: {
      id: 'myId',
      class: 'myClass',
      other: 'otherAtt'
    }
  })
  const parsed = parseAttribs(schema)
  t.is(parsed.length, 3)
  const [id, className, other] = parsed
  t.same(['plain', 'id', 'myId'], id)
  t.same(['plain', 'class', 'myClass'], className)
  t.same(['plain', 'other', 'otherAtt'], other)
  t.end()
})

test('ParseAttConstant', t => {
  const schema = Object.assign({}, baseComp, {
    attribs: {
      id: '{ myId }',
      class: '{ myClass    }',
      other: 'otherAtt'
    }
  })
  const parsed = parseAttribs(schema)
  t.is(parsed.length, 3)
  const [id, className, other] = parsed
  t.same(['constant', 'id', 'myId'], id)
  t.same(['constant', 'class', 'myClass'], className)
  t.same(['plain', 'other', 'otherAtt'], other)
  t.end()
})

test('parseAttVariable', t => {
  const schema = Object.assign({}, baseComp, {
    attribs: {
      id: '{: myId }',
      class: '{: myClass    }',
      other: 'otherAtt'
    }
  })
  const parsed = parseAttribs(schema)
  t.is(parsed.length, 3)
  const [id, className, other] = parsed
  t.same(['variable', 'id', 'myId'], id)
  t.same(['variable', 'class', 'myClass'], className)
  t.same(['plain', 'other', 'otherAtt'], other)
  t.end()
})

test('ParseAttEvent', t => {
  const schema = Object.assign({}, baseComp, {
    attribs: {
      '@click': 'clicked',
      '@dblclick': 'doubleclicked'
    }
  })
  const parsed = parseAttribs(schema)
  t.is(parsed.length, 2)
  const [single, double] = parsed
  t.same(single, ['event', 'click', 'clicked'])
  t.same(double, ['event', 'dblclick', 'doubleclicked'])
  t.end()
})
