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

test('Parse attribute: parseAttPlain', t => {
  const schema = Object.assign({}, baseComp, {
    attribs: {
      id: 'myId',
      other: 'otherAtt',
      another: 'anotherAtt'
    }
  })
  const parsed = parseAttribs(schema)
  const [id, other, another] = parsed
  const resultId = {
    kind: 'plain',
    propName: 'id',
    value: 'myId',
    variables: []
  }
  t.same(id, resultId)
  const resultOther = {
    kind: 'plain',
    propName: 'other',
    value: 'otherAtt',
    variables: []
  }
  t.same(other, resultOther)
  const resultAnother = {
    kind: 'plain',
    propName: 'another',
    value: 'anotherAtt',
    variables: []
  }
  t.same(another, resultAnother)
  t.end()
})

test('Parse attribute: parseAttConstant', t => {
  const schema = Object.assign({}, baseComp, {
    attribs: {
      id: '{ myId }',
      other: 'otherAtt',
      another: '{ anotherAtt    }'
    }
  })
  const parsed = parseAttribs(schema)
  t.is(parsed.length, 3)
  const [id, other, another] = parsed
  const resultId = {
    kind: 'constant',
    propName: 'id',
    value: "${box.myId ?? ''}",
    variables: []
  }
  t.same(id, resultId)
  const resultOther = {
    kind: 'plain',
    propName: 'other',
    value: 'otherAtt',
    variables: []
  }
  t.same(other, resultOther)
  const resultAnother = {
    kind: 'constant',
    propName: 'another',
    value: "${box.anotherAtt ?? ''}",
    variables: []
  }
  t.same(another, resultAnother)
  t.end()
})

test('Parse attribute: parseAttVariable', t => {
  const schema = Object.assign({}, baseComp, {
    attribs: {
      id: '{: myId }',
      other: 'otherAtt',
      another: '{: anotherAtt    }'
    }
  })
  const parsed = parseAttribs(schema)
  t.is(parsed.length, 3)
  const [id, other, another] = parsed
  const resultId = {
    kind: 'variable',
    propName: 'id',
    value: "${box.myId ?? ''}",
    variables: ['myId']
  }
  t.same(id, resultId)
  const resultOther = {
    kind: 'plain',
    propName: 'other',
    value: 'otherAtt',
    variables: []
  }
  t.same(other, resultOther)
  const resultAnother = {
    kind: 'variable',
    propName: 'another',
    value: "${box.anotherAtt ?? ''}",
    variables: ['anotherAtt']
  }
  t.same(another, resultAnother)
  t.end()
})

test('Parse attribute: ParseAttEvent', t => {
  const schema = Object.assign({}, baseComp, {
    attribs: {
      '@click': 'clicked',
      '@dblclick': 'doubleclicked'
    }
  })
  const parsed = parseAttribs(schema)
  t.is(parsed.length, 2)
  const [single, double] = parsed
  const singleRes = {
    kind: 'event',
    propName: 'click',
    value: 'clicked',
    variables: []
  }
  t.same(single, singleRes)
  const doubleRes = {
    kind: 'event',
    propName: 'dblclick',
    value: 'doubleclicked',
    variables: []
  }
  t.same(double, doubleRes)
  t.end()
})

test('Parse attribute: ParseBooleanConst', t => {
  const schema = Object.assign({}, baseComp, {
    attribs: {
      checked: 'uno',
      hidden: ' other '
    }
  })
  const parsed = parseAttribs(schema)
  t.is(parsed.length, 2)
  const [checked, other] = parsed
  const resultChecked = {
    kind: 'booleanConst',
    propName: 'checked',
    value: 'uno',
    variables: []
  }
  t.same(checked, resultChecked)
  const resultOther = {
    kind: 'booleanConst',
    propName: 'hidden',
    value: 'other',
    variables: []
  }
  t.same(other, resultOther)
  t.end()
})

test('Parse attribute: ParseBooleanVar', t => {
  const schema = Object.assign({}, baseComp, {
    attribs: {
      checked: ':uno',
      hidden: ': other '
    }
  })
  const parsed = parseAttribs(schema)
  t.is(parsed.length, 2)
  const [checked, other] = parsed
  const resultChecked = {
    kind: 'booleanVar',
    propName: 'checked',
    value: 'uno',
    variables: ['uno']
  }
  t.same(checked, resultChecked)
  const resultOther = {
    kind: 'booleanVar',
    propName: 'hidden',
    value: 'other',
    variables: ['other']
  }
  t.same(other, resultOther)
  t.end()
})

test('Parse attribute: ParseConditionalConst', t => {
  const schema = Object.assign({}, baseComp, {
    attribs: {
      '(if)': ' uno '
    }
  })
  const parsed = parseAttribs(schema)
  t.is(parsed.length, 1)
  const [ifcond] = parsed
  const result = {
    kind: 'conditionalConst',
    propName: '(if)',
    value: 'uno',
    variables: []
  }
  t.same(ifcond, result)
  t.end()
})

test('Parse attribute: parseConditionalVar', t => {
  const schema = Object.assign({}, baseComp, {
    attribs: {
      '(if)': ': uno '
    }
  })
  const parsed = parseAttribs(schema)
  t.is(parsed.length, 1)
  const [ifcond] = parsed
  const result = {
    kind: 'conditionalVar',
    propName: '(if)',
    value: 'uno',
    variables: ['uno']
  }
  t.same(ifcond, result)
  t.end()
})

test('Parse attribute: parseProp', t => {
  const schema = Object.assign({}, baseComp, {
    attribs: {
      ':prop1': ' uno   ',
      ':prop2': ' dos   '
    }
  })
  const parsed = parseAttribs(schema)
  t.is(parsed.length, 2)
  const [prop1, prop2] = parsed
  const result1 = {
    kind: 'prop',
    propName: 'prop1',
    value: 'uno',
    variables: ['uno']
  }
  t.same(prop1, result1)
  const result2 = {
    kind: 'prop',
    propName: 'prop2',
    value: 'dos',
    variables: ['dos']
  }
  t.same(prop2, result2)
  t.end()
})

test.skip('ParseClass', t => {
  t.fail()
  t.end()
})

test('Parse attribute: parseIndexConst', t => {
  const schema = Object.assign({}, baseComp, {
    attribs: {
      '(index)': ' position '
    }
  })
  const parsed = parseAttribs(schema)
  t.is(parsed.length, 1)
  const [indexAtt] = parsed
  const result = {
    kind: 'indexConst',
    propName: '(index)',
    value: 'position',
    variables: []
  }
  t.same(indexAtt, result)
  t.end()
})

test('Parse attribute: parseIndexVar', t => {
  const schema = Object.assign({}, baseComp, {
    attribs: {
      '(index)': ': position '
    }
  })
  const parsed = parseAttribs(schema)
  t.is(parsed.length, 1)
  const [indexAtt] = parsed
  const result = {
    kind: 'indexVar',
    propName: '(index)',
    value: 'position',
    variables: []
  }
  t.same(indexAtt, result)
  t.end()
})
