import { ElemSchema } from '../../src/common';

import { parseConditional } from '../../src/parser/parse-conditional';

const baseChildren = [
  {
    kind: 'text',
    mode: 'plain',
    literal: 'lit',
    variables: [],
  },
  {
    kind: 'tag',
    name: 'span',
    attribs: [
      {
        kind: 'conditionalConst',
        propName: '(if)',
        value: 'x.y',
        variables: ['x.y'],
      },
    ],
    children: [],
  },
  {
    kind: 'tag',
    name: 'p',
    attribs: [],
    children: [],
  },
];

test('Parse conditional: if-const', () => {
  const [first, second, third] = parseConditional(baseChildren as ElemSchema[]);
  const result = {
    kind: 'conditionalConst',
    conditions: ['box => !!box.x?.y'],
    variables: ['x.y'],
    children: [
      {
        kind: 'tag',
        name: 'span',
        attribs: [],
        children: [],
      },
    ],
  };
  expect(first).toEqual(baseChildren[0]);
  expect(second).toEqual(result);
  expect(third).toEqual(baseChildren[2]);
});

test('Parse conditional: if-else-const', () => {
  const elseTag = {
    kind: 'tag',
    name: 'div',
    attribs: [
      {
        kind: 'conditionalConst',
        propName: '(else)',
        value: '',
        variables: [],
      },
    ],
    children: [],
  };
  const base = baseChildren.slice();
  base.splice(2, 0, elseTag);
  const [first, second, third] = parseConditional(base as ElemSchema[]);
  const result = {
    kind: 'conditionalConst',
    conditions: ['box => !!box.x?.y'],
    variables: ['x.y'],
    children: [
      {
        kind: 'tag',
        name: 'span',
        attribs: [],
        children: [],
      },
      {
        kind: 'tag',
        name: 'div',
        attribs: [],
        children: [],
      },
    ],
  };
  expect(first).toEqual(baseChildren[0]);
  expect(second).toEqual(result);
  expect(third).toEqual(baseChildren[2]);
});

test('Parse conditional: if-var', () => {
  const iftag = {
    kind: 'tag',
    name: 'span',
    attribs: [
      {
        kind: 'conditionalVar',
        propName: '(if)',
        value: ': x.y',
        variables: ['x.y'],
      },
    ],
    children: [],
  };
  const base = baseChildren.slice();
  base.splice(1, 1, iftag);
  const [first, second, third] = parseConditional(base as ElemSchema[]);
  const result = {
    kind: 'conditionalVar',
    conditions: ['box => !!box.x?.y'],
    variables: ['x.y'],
    children: [
      {
        kind: 'tag',
        name: 'span',
        attribs: [],
        children: [],
      },
    ],
  };
  expect(first).toEqual(baseChildren[0]);
  expect(second).toEqual(result);
  expect(third).toEqual(baseChildren[2]);
});

test('Parse conditional: if-else-var', () => {
  const ifTag = {
    kind: 'tag',
    name: 'span',
    attribs: [
      {
        kind: 'conditionalVar',
        propName: '(if)',
        value: ': x.y',
        variables: ['x.y'],
      },
    ],
    children: [],
  };
  const elseTag = {
    kind: 'tag',
    name: 'div',
    attribs: [
      {
        kind: 'conditionalConst',
        propName: '(else)',
        value: '',
        variables: [],
      },
    ],
    children: [],
  };
  const base = baseChildren.slice();
  base.splice(1, 1, ifTag, elseTag);
  const [first, second, third] = parseConditional(base as ElemSchema[]);
  const result = {
    kind: 'conditionalVar',
    conditions: ['box => !!box.x?.y'],
    variables: ['x.y'],
    children: [
      {
        kind: 'tag',
        name: 'span',
        attribs: [],
        children: [],
      },
      {
        kind: 'tag',
        name: 'div',
        attribs: [],
        children: [],
      },
    ],
  };
  expect(first).toEqual(baseChildren[0]);
  expect(second).toEqual(result);
  expect(third).toEqual(baseChildren[2]);
});
