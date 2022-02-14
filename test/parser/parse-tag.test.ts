import { parseTag } from '../../src/parser/parse-children';
import {
  RawTagSchema,
  TagSchema,
  LoopSchema,
  CondSchema,
} from '../../src/types';

const staticTag: RawTagSchema = {
  type: 'tag',
  name: 'span',
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
test('Parse tag: static', () => {
  const { kind, name, attributes, children } = parseTag(staticTag) as TagSchema;
  expect(kind).toBe('tag');
  expect(name).toBe('span');
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

test('Parse tag: dynamic', () => {
  const dynamicTag: RawTagSchema = {
    type: 'tag',
    name: 'span',
    attribs: { ':one': 'uno', '::two': 'dos' },
    children: [
      {
        type: 'text',
        data: 'hola',
      },
    ],
  };
  const { kind, name, attributes, children } = parseTag(
    dynamicTag
  ) as TagSchema;
  expect(kind).toBe('tag');
  expect(name).toBe('span');
  expect(attributes).toEqual([
    {
      kind: 'attribute',
      name: 'one',
      value: 'uno',
      isBoolean: false,
      dynamic: true,
      reactive: false,
    },
    {
      kind: 'attribute',
      name: 'two',
      value: 'dos',
      isBoolean: false,
      dynamic: true,
      reactive: true,
    },
  ]);
  expect(children[0].kind).toBe('text');
});

test('Parse tag: with loop directive', () => {
  const loopedTag: RawTagSchema = {
    type: 'tag',
    name: 'span',
    attribs: { '(loop)': 'list', id: 'myid', '(index)': 'i', '(pos)': 'p' },
    children: [],
  };
  const { kind, target, index, pos, children } = parseTag(
    loopedTag
  ) as LoopSchema;
  expect(kind).toBe('loop');
  expect(target).toBe('list');
  expect(index).toBe('i');
  expect(pos).toBe('p');
  const child = children[0] as TagSchema;
  expect(child.kind).toBe('tag');
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

test('Parse tag: with conditional directive', () => {
  const ifTag: RawTagSchema = {
    type: 'tag',
    name: 'span',
    attribs: { '(if)': 'isUser', id: 'myid' },
    children: [],
  };
  const { kind, target, condition, reactive, children } = parseTag(
    ifTag
  ) as CondSchema;
  expect(kind).toBe('condition');
  expect(condition).toBe('if');
  expect(reactive).toBe(false);
  expect(target).toBe('isUser');
  const child = children[0] as TagSchema;
  expect(child.kind).toBe('tag');
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

test('Parse tag: with loop and conditional directives', () => {
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
  const { kind, condition, target, reactive, children } = parseTag(
    multiTag
  ) as CondSchema;

  expect(kind).toBe('condition');
  expect(condition).toBe('if');
  expect(reactive).toBe(false);
  expect(target).toBe('isUser');

  const loop = children[0] as LoopSchema;

  expect(loop.kind).toBe('loop');
  expect(loop.target).toBe('list');
  expect(loop.index).toBe('i');
  expect(loop.pos).toBe('p');

  const child = loop.children[0] as TagSchema;
  expect(child.kind).toBe('tag');
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
