import { parseSubcomp } from '../../src/parser/parse-children';
import {
  RawTagSchema,
  SubCompSchema,
  LoopSchema,
  CondSchema,
} from '../../src/types';

const staticComp: RawTagSchema = {
  type: 'tag',
  name: 'my-tag',
  attribs: { id: 'myid', class: 'clase', hidden: '' },
  children: [
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
  ],
};

test('Parse component: static attributes', () => {
  const { kind, name, attributes, children } = parseSubcomp(
    staticComp
  ) as SubCompSchema;
  expect(kind).toBe('component');
  expect(name).toBe('my-tag');
  expect(attributes).toEqual([
    {
      kind: 'attribute',
      name: 'id',
      value: 'myid',
      isBoolean: false,
      dynamic: false,
      reactive: false,
    },
    {
      kind: 'attribute',
      name: 'class',
      value: 'clase',
      isBoolean: false,
      dynamic: false,
      reactive: false,
    },
    {
      kind: 'attribute',
      name: 'hidden',
      value: '',
      isBoolean: true,
      dynamic: false,
      reactive: false,
    },
  ]);
  expect(children[0].kind).toBe('text');
  expect(children[1].kind).toBe('component');
});

test('Parse component: dynamic attributes', () => {
  const dynamicTag: RawTagSchema = {
    type: 'tag',
    name: 'my-tag',
    attribs: { ':one': 'uno', '::two': 'dos' },
    children: [
      {
        type: 'text',
        data: 'hola',
      },
    ],
  };
  const { kind, name, attributes, children } = parseSubcomp(
    dynamicTag
  ) as SubCompSchema;
  expect(kind).toBe('component');
  expect(name).toBe('my-tag');
  expect(attributes).toEqual([
    {
      kind: 'attribute',
      name: 'one',
      value: 'uno',
      isBoolean: false,
      dynamic: true,
      reactive: false,
      expr: [{ scope: 0, value: 'uno' }],
    },
    {
      kind: 'attribute',
      name: 'two',
      value: 'dos',
      isBoolean: false,
      dynamic: true,
      reactive: true,
      expr: [{ scope: 0, value: 'dos' }],
    },
  ]);
  expect(children[0].kind).toBe('text');
});

test('Parse component: with loop directive', () => {
  const loopedTag: RawTagSchema = {
    type: 'tag',
    name: 'my-tag',
    attribs: { '(loop)': 'list', id: 'myid', '(index)': 'i', '(pos)': 'p' },
    children: [],
  };
  const { kind, target, index, pos, children } = parseSubcomp(
    loopedTag
  ) as LoopSchema;
  expect(kind).toBe('loop');
  expect(target).toEqual([{ scope: 0, value: 'list' }]);
  expect(index).toBe('i');
  expect(pos).toBe('p');
  const child = children[0] as SubCompSchema;
  expect(child.kind).toBe('component');
  expect(child.attributes).toEqual([
    {
      kind: 'attribute',
      name: 'id',
      value: 'myid',
      isBoolean: false,
      dynamic: false,
      reactive: false,
    },
  ]);
});

test('Parse component: with conditional directive', () => {
  const ifTag: RawTagSchema = {
    type: 'tag',
    name: 'my-tag',
    attribs: { '(if)': 'isUser', id: 'myid' },
    children: [],
  };
  const { kind, target, condition, reactive, children } = parseSubcomp(
    ifTag
  ) as CondSchema;
  expect(kind).toBe('condition');
  expect(condition).toBe('if');
  expect(reactive).toBe(false);
  expect(target).toEqual([{ scope: 0, value: 'isUser' }]);
  const child = children[0] as SubCompSchema;
  expect(child.kind).toBe('component');
  expect(child.attributes).toEqual([
    {
      kind: 'attribute',
      name: 'id',
      value: 'myid',
      isBoolean: false,
      dynamic: false,
      reactive: false,
    },
  ]);
});

test('Parse component: with loop and conditional directives', () => {
  const multiTag: RawTagSchema = {
    type: 'tag',
    name: 'span',
    attribs: {
      '(if)': 'isUser',
      id: 'myid',
      '(loop)': 'list',
      '(index)': 'i',
      '(pos)': 'p',
    },
    children: [],
  };
  const { kind, condition, target, reactive, children } = parseSubcomp(
    multiTag
  ) as CondSchema;

  expect(kind).toBe('condition');
  expect(condition).toBe('if');
  expect(reactive).toBe(false);
  expect(target).toEqual([{ scope: 0, value: 'isUser' }]);

  const loop = children[0] as LoopSchema;
  expect(loop.kind).toBe('loop');
  expect(loop.target).toEqual([{ scope: 0, value: 'list' }]);
  expect(loop.index).toBe('i');
  expect(loop.pos).toBe('p');

  const child = loop.children[0] as SubCompSchema;
  expect(child.kind).toBe('component');
  expect(child.attributes).toEqual([
    {
      kind: 'attribute',
      name: 'id',
      value: 'myid',
      isBoolean: false,
      dynamic: false,
      reactive: false,
    },
  ]);
});
