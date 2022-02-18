import { parseDirective } from '../../src/parser/parse-directive';

import {
  RawTagSchema,
  LoopSchema,
  CondSchema,
  RawSchema,
} from '../../src/types';

const theChildren: RawSchema[] = [
  {
    type: 'text',
    data: 'hola',
  },
  {
    type: 'tag',
    name: 'my-comp',
    attribs: {},
    children: [],
  },
];

const childrenResult = [
  {
    kind: 'text',
    chunks: [{ dynamic: false, reactive: false, value: 'hola' }],
  },
  {
    kind: 'component',
    name: 'my-comp',
    attributes: [],
    children: [],
    events: [],
    ref: undefined,
  },
];

test('Parse directive: loop', () => {
  const loopTag: RawTagSchema = {
    type: 'tag',
    name: 'loop',
    attribs: { '(list)': '', '(index)': 'i', '(pos)': 'p' },
    children: theChildren,
  };
  const parsed = parseDirective(loopTag) as LoopSchema;
  expect(parsed).toEqual({
    kind: 'loop',
    target: [{ scope: 0, value: 'list' }],
    index: 'i',
    pos: 'p',
    children: childrenResult,
  });
});

test('Parse conditional: if', () => {
  const loopTag: RawTagSchema = {
    type: 'tag',
    name: 'if',
    attribs: { '(index)': 'i', '(isTrue)': '', '(pos)': 'p' },
    children: theChildren,
  };
  const parsed = parseDirective(loopTag) as CondSchema;
  expect(parsed).toEqual({
    kind: 'condition',
    condition: 'if',
    target: [{ scope: 0, value: 'isTrue' }],
    reactive: false,
    children: childrenResult,
  });
});

test('Parse conditional: else', () => {
  const loopTag: RawTagSchema = {
    type: 'tag',
    name: 'else',
    attribs: { '(index)': 'i', '(isTrue)': '', '(pos)': 'p' },
    children: theChildren,
  };
  const parsed = parseDirective(loopTag) as CondSchema;
  expect(parsed).toEqual({
    kind: 'condition',
    condition: 'else',
    target: [{ scope: 0, value: 'isTrue' }],
    reactive: false,
    children: childrenResult,
  });
});

test('Parse conditional: loop tag with `(if)` directive', () => {
  const loopTag: RawTagSchema = {
    type: 'tag',
    name: 'loop',
    attribs: { '(index)': 'i', '(list)': '', '(pos)': 'p', '(if)': 'isTrue' },
    children: theChildren,
  };
  const parsed = parseDirective(loopTag) as CondSchema;
  expect(parsed).toEqual({
    kind: 'condition',
    condition: 'if',
    target: [{ scope: 0, value: 'isTrue' }],
    reactive: false,
    children: [
      {
        kind: 'loop',
        target: [{ scope: 0, value: 'list' }],
        index: 'i',
        pos: 'p',
        children: childrenResult,
      },
    ],
  });
});
