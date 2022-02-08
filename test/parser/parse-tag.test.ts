import { parseTag } from '../../src/parser/parse-tag';
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
  const { kind, target, condition, reactive, childrenTrue, childrenFalse } =
    parseTag(ifTag) as CondSchema;
  expect(kind).toBe('condition');
  expect(condition).toBe('if');
  expect(reactive).toBe(false);
  expect(target).toBe('isUser');
  const child = childrenTrue[0] as TagSchema;
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
  const childNo = childrenFalse[0] as TagSchema;
  expect(childNo).toBe(undefined);
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
  const { kind, index, target, pos, children } = parseTag(
    multiTag
  ) as LoopSchema;

  expect(kind).toBe('loop');
  expect(target).toBe('list');
  expect(index).toBe('i');
  expect(pos).toBe('p');
  const cond = children[0] as CondSchema;

  expect(cond.kind).toBe('condition');
  expect(cond.condition).toBe('if');
  expect(cond.reactive).toBe(false);
  expect(cond.target).toBe('isUser');
  const child = cond.childrenTrue[0] as TagSchema;
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
