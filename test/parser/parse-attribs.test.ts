import { parseAttribs } from '../../src/parser/parse-attribs';

const baseComp = {
  type: 'tag',
  name: 'tagname',
  attribs: {},
  children: [],
};

test('Parse#attribs', () => {
  const parsed = parseAttribs(baseComp);
  expect([]).toEqual(parsed);
});

test('Parse attribute: parseAttPlain', () => {
  const schema = Object.assign({}, baseComp, {
    attribs: {
      id: 'myId',
      other: 'otherAtt',
      another: 'anotherAtt',
    },
  });
  const parsed = parseAttribs(schema);
  const [id, other, another] = parsed;
  const resultId = {
    kind: 'plain',
    propName: 'id',
    value: 'myId',
    variables: [],
  };
  expect(id).toEqual(resultId);
  const resultOther = {
    kind: 'plain',
    propName: 'other',
    value: 'otherAtt',
    variables: [],
  };
  expect(other).toEqual(resultOther);
  const resultAnother = {
    kind: 'plain',
    propName: 'another',
    value: 'anotherAtt',
    variables: [],
  };
  expect(another).toEqual(resultAnother);
});

test('Parse attribute: parseAttConstant', () => {
  const schema = Object.assign({}, baseComp, {
    attribs: {
      id: '{ myId }',
      other: 'otherAtt',
      another: '{ anotherAtt    }',
    },
  });
  const parsed = parseAttribs(schema);
  expect(parsed.length).toBe(3);
  const [id, other, another] = parsed;
  const resultId = {
    kind: 'constant',
    propName: 'id',
    value: "${box.myId ?? ''}",
    variables: [],
  };
  expect(id).toEqual(resultId);
  const resultOther = {
    kind: 'plain',
    propName: 'other',
    value: 'otherAtt',
    variables: [],
  };
  expect(other).toEqual(resultOther);
  const resultAnother = {
    kind: 'constant',
    propName: 'another',
    value: "${box.anotherAtt ?? ''}",
    variables: [],
  };
  expect(another).toEqual(resultAnother);
});

test('Parse attribute: parseAttVariable', () => {
  const schema = Object.assign({}, baseComp, {
    attribs: {
      id: '{: myId }',
      other: 'otherAtt',
      another: '{: anotherAtt    }',
    },
  });
  const parsed = parseAttribs(schema);
  expect(parsed.length).toBe(3);
  const [id, other, another] = parsed;
  const resultId = {
    kind: 'variable',
    propName: 'id',
    value: "${box.myId ?? ''}",
    variables: ['myId'],
  };
  expect(id).toEqual(resultId);
  const resultOther = {
    kind: 'plain',
    propName: 'other',
    value: 'otherAtt',
    variables: [],
  };
  expect(other).toEqual(resultOther);
  const resultAnother = {
    kind: 'variable',
    propName: 'another',
    value: "${box.anotherAtt ?? ''}",
    variables: ['anotherAtt'],
  };
  expect(another).toEqual(resultAnother);
});

test('Parse attribute: ParseAttEvent', () => {
  const schema = Object.assign({}, baseComp, {
    attribs: {
      '@click': 'clicked',
      '@dblclick': 'doubleclicked',
    },
  });
  const parsed = parseAttribs(schema);
  expect(parsed.length).toBe(2);
  const [single, double] = parsed;
  const singleRes = {
    kind: 'event',
    propName: 'click',
    value: 'clicked',
    variables: [],
  };
  expect(single).toEqual(singleRes);
  const doubleRes = {
    kind: 'event',
    propName: 'dblclick',
    value: 'doubleclicked',
    variables: [],
  };
  expect(double).toEqual(doubleRes);
});

test('Parse attribute: ParseBooleanConst', () => {
  const schema = Object.assign({}, baseComp, {
    attribs: {
      checked: 'uno',
      hidden: ' other ',
    },
  });
  const parsed = parseAttribs(schema);
  expect(parsed.length).toBe(2);
  const [checked, other] = parsed;
  const resultChecked = {
    kind: 'booleanConst',
    propName: 'checked',
    value: 'uno',
    variables: [],
  };
  expect(checked).toEqual(resultChecked);
  const resultOther = {
    kind: 'booleanConst',
    propName: 'hidden',
    value: 'other',
    variables: [],
  };
  expect(other).toEqual(resultOther);
});

test('Parse attribute: ParseBooleanVar', () => {
  const schema = Object.assign({}, baseComp, {
    attribs: {
      checked: ':uno',
      hidden: ': other ',
    },
  });
  const parsed = parseAttribs(schema);
  expect(parsed.length).toBe(2);
  const [checked, other] = parsed;
  const resultChecked = {
    kind: 'booleanVar',
    propName: 'checked',
    value: 'uno',
    variables: ['uno'],
  };
  expect(checked).toEqual(resultChecked);
  const resultOther = {
    kind: 'booleanVar',
    propName: 'hidden',
    value: 'other',
    variables: ['other'],
  };
  expect(other).toEqual(resultOther);
});

test('Parse attribute: ParseConditionalConst', () => {
  const schema = Object.assign({}, baseComp, {
    attribs: {
      '(if)': ' uno ',
    },
  });
  const parsed = parseAttribs(schema);
  expect(parsed.length).toBe(1);
  const [ifcond] = parsed;
  const result = {
    kind: 'conditionalConst',
    propName: '(if)',
    value: 'uno',
    variables: [],
  };
  expect(ifcond).toEqual(result);
});

test('Parse attribute: parseConditionalVar', () => {
  const schema = Object.assign({}, baseComp, {
    attribs: {
      '(if)': ': uno ',
    },
  });
  const parsed = parseAttribs(schema);
  expect(parsed.length).toBe(1);
  const [ifcond] = parsed;
  const result = {
    kind: 'conditionalVar',
    propName: '(if)',
    value: 'uno',
    variables: ['uno'],
  };
  expect(ifcond).toEqual(result);
});

test('Parse attribute: parseProp', () => {
  const schema = Object.assign({}, baseComp, {
    attribs: {
      ':prop1': ' uno   ',
      ':prop2': ' dos   ',
    },
  });
  const parsed = parseAttribs(schema);
  expect(parsed.length).toBe(2);
  const [prop1, prop2] = parsed;
  const result1 = {
    kind: 'prop',
    propName: 'prop1',
    value: 'uno',
    variables: ['uno'],
  };
  expect(prop1).toEqual(result1);
  const result2 = {
    kind: 'prop',
    propName: 'prop2',
    value: 'dos',
    variables: ['dos'],
  };
  expect(prop2).toEqual(result2);
});

// TODO
// test.skip('ParseClass', (t) => {
//   t.fail();
//   t.end();
// });

test('Parse attribute: parseIndexConst', () => {
  const schema = Object.assign({}, baseComp, {
    attribs: {
      '(index)': ' position ',
    },
  });
  const parsed = parseAttribs(schema);
  expect(parsed.length).toBe(1);
  const [indexAtt] = parsed;
  const result = {
    kind: 'indexConst',
    propName: '(index)',
    value: 'position',
    variables: [],
  };
  expect(indexAtt).toEqual(result);
});

test('Parse attribute: parseIndexVar', () => {
  const schema = Object.assign({}, baseComp, {
    attribs: {
      '(index)': ': position ',
    },
  });
  const parsed = parseAttribs(schema);
  expect(parsed.length).toBe(1);
  const [indexAtt] = parsed;
  const result = {
    kind: 'indexVar',
    propName: '(index)',
    value: 'position',
    variables: [],
  };
  expect(indexAtt).toEqual(result);
});
