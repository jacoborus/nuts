import { parseAttribs } from '../../src/parser/parse-attribs';
import { RawTagSchema } from '../../src/types';

const baseComp = {
  type: 'tag',
  name: 'tagname',
  attribs: {},
  children: [],
} as RawTagSchema;

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
    type: 'attribute',
    name: 'id',
    value: 'myId',
    isBoolean: false,
    dynamic: false,
    reactive: false,
  };
  expect(id).toEqual(resultId);
  const resultHidden = {
    type: 'attribute',
    name: 'hidden',
    value: '',
    isBoolean: true,
    dynamic: false,
    reactive: false,
  };
  expect(hidden).toEqual(resultHidden);
  const resultOther = {
    type: 'attribute',
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
      ':hidden': ' hiddenAtt.val    ',
      '::reactor': 'reactorAtt.valor',
    },
  });
  const parsed = parseAttribs(schema as RawTagSchema);
  expect(parsed.length).toBe(3);
  const [id, hidden, reactor] = parsed;
  const resultId = {
    type: 'attribute',
    name: 'id',
    value: 'myId',
    isBoolean: false,
    dynamic: true,
    reactive: false,
    expr: [{ scope: 0, value: 'myId' }],
  };
  expect(id).toEqual(resultId);
  const resultHidden = {
    type: 'attribute',
    name: 'hidden',
    value: 'hiddenAtt.val',
    isBoolean: true,
    dynamic: true,
    reactive: false,
    expr: [
      { scope: 0, value: 'hiddenAtt' },
      { scope: 0, value: 'val' },
    ],
  };
  expect(hidden).toEqual(resultHidden);
  const resultReactor = {
    type: 'attribute',
    name: 'reactor',
    value: 'reactorAtt.valor',
    isBoolean: false,
    dynamic: true,
    reactive: true,
    expr: [
      { scope: 0, value: 'reactorAtt' },
      { scope: 0, value: 'valor' },
    ],
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
    type: 'event',
    name: 'click',
    value: 'clicked',
  };
  expect(single).toEqual(singleRes);
  const doubleRes = {
    type: 'event',
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
      type: 'directive',
      name,
      value: name,
    };
  }
  results.forEach((name, i) => {
    const result = getResult(name);
    expect(parsed[i]).toEqual(result);
  });
});
