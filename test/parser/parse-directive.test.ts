import { parseDirective } from '../../src/parser/parse-directive';

import {
  RawTagSchema,
  LoopSchema,
  TreeSchema,
  RawSchema,
  NodeTypes,
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
    type: NodeTypes.TEXT,
    dynamic: false,
    reactive: false,
    value: 'hola',
  },
  {
    type: NodeTypes.COMPONENT,
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
    type: NodeTypes.LOOP,
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
  const parsed = parseDirective(loopTag) as TreeSchema;
  expect(parsed).toEqual({
    type: NodeTypes.TREE,
    kind: 'if',
    requirement: [{ scope: 0, value: 'isTrue' }],
    reactive: false,
    yes: childrenResult,
    no: [],
  });
});

test('Parse conditional: else', () => {
  const loopTag: RawTagSchema = {
    type: 'tag',
    name: 'else',
    attribs: { '(index)': 'i', '(isTrue)': '', '(pos)': 'p' },
    children: theChildren,
  };
  const parsed = parseDirective(loopTag) as TreeSchema;
  expect(parsed).toEqual({
    type: NodeTypes.TREE,
    kind: 'else',
    requirement: [{ scope: 0, value: 'isTrue' }],
    reactive: false,
    yes: [],
    no: childrenResult,
  });
});

test('Parse conditional: loop tag with `(if)` directive', () => {
  const loopTag: RawTagSchema = {
    type: 'tag',
    name: 'loop',
    attribs: { '(index)': 'i', '(list)': '', '(pos)': 'p', '(if)': 'isTrue' },
    children: theChildren,
  };
  const parsed = parseDirective(loopTag) as TreeSchema;
  expect(parsed).toEqual({
    type: NodeTypes.TREE,
    kind: 'if',
    requirement: [{ scope: 0, value: 'isTrue' }],
    reactive: false,
    yes: [
      {
        type: NodeTypes.LOOP,
        target: [{ scope: 0, value: 'list' }],
        index: 'i',
        pos: 'p',
        children: childrenResult,
      },
    ],
    no: [],
  });
});
