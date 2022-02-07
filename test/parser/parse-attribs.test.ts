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

test('Parse attribute: static', () => {
  const schema = Object.assign({}, baseComp, {
    attribs: {
      id: 'myId',
      hidden: '',
      other: 'otherAtt',
    },
  });
  const parsed = parseAttribs(schema);
  const [id, hidden, other] = parsed;
  const resultId = {
    kind: 'attribute',
    name: 'id',
    value: 'myId',
    isBoolean: false,
    dynamic: false,
    reactive: false,
  };
  expect(id).toEqual(resultId);
  const resultHidden = {
    kind: 'attribute',
    name: 'hidden',
    value: '',
    isBoolean: true,
    dynamic: false,
    reactive: false,
  };
  expect(hidden).toEqual(resultHidden);
  const resultOther = {
    kind: 'attribute',
    name: 'other',
    value: 'otherAtt',
    isBoolean: false,
    dynamic: false,
    reactive: false,
  };
  expect(other).toEqual(resultOther);
});

test('Parse attribute: dynamic and reactive', () => {
  const schema = Object.assign({}, baseComp, {
    attribs: {
      ':id': 'myId',
      ':hidden': ' hiddenAtt    ',
      '::reactor': 'reactorAtt',
    },
  });
  const parsed = parseAttribs(schema);
  expect(parsed.length).toBe(3);
  const [id, hidden, reactor] = parsed;
  const resultId = {
    kind: 'attribute',
    name: 'id',
    value: 'myId',
    isBoolean: false,
    dynamic: true,
    reactive: false,
  };
  expect(id).toEqual(resultId);
  const resultHidden = {
    kind: 'attribute',
    name: 'hidden',
    value: 'hiddenAtt',
    isBoolean: true,
    dynamic: true,
    reactive: false,
  };
  expect(hidden).toEqual(resultHidden);
  const resultReactor = {
    kind: 'attribute',
    name: 'reactor',
    value: 'reactorAtt',
    isBoolean: false,
    dynamic: true,
    reactive: true,
  };
  expect(reactor).toEqual(resultReactor);
});

test('Parse attribute: event', () => {
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
    name: 'click',
    value: 'clicked',
  };
  expect(single).toEqual(singleRes);
  const doubleRes = {
    kind: 'event',
    name: 'dblclick',
    value: 'doubleclicked',
  };
  expect(double).toEqual(doubleRes);
});

test('Parse attribute: directive', () => {
  const schema = Object.assign({}, baseComp, {
    attribs: {
      '(loop)': 'loop',
      '(index)': 'index',
      '(if)': 'if',
      '(elseif)': 'elseif',
      '(else)': 'else',
      '(ref)': 'ref',
    },
  });
  const parsed = parseAttribs(schema);
  expect(parsed.length).toBe(6);
  const results = ['loop', 'index', 'if', 'elseif', 'else', 'ref'];
  function getResult(name: string) {
    return {
      kind: 'directive',
      name,
      value: name,
    };
  }
  results.forEach((name, i) => {
    const result = getResult(name);
    expect(parsed[i]).toEqual(result);
  });
});
