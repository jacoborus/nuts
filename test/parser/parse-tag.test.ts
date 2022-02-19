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
  const { type, name, attributes, children } = parseTag(staticTag) as TagSchema;
  expect(type).toBe('tag');
  expect(name).toBe('span');
  expect(attributes).toEqual([
    {
      type: 'attribute',
      name: 'id',
      value: 'myid',
      isBoolean: false,
      dynamic: false,
      reactive: false,
    },
    {
      type: 'attribute',
      name: 'class',
      value: 'clase',
      isBoolean: false,
      dynamic: false,
      reactive: false,
    },
    {
      type: 'attribute',
      name: 'hidden',
      value: '',
      isBoolean: true,
      dynamic: false,
      reactive: false,
    },
  ]);
  expect(children[0].type).toBe('text');
  expect(children[1].type).toBe('component');
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
  const { type, name, attributes, children } = parseTag(
    dynamicTag
  ) as TagSchema;
  expect(type).toBe('tag');
  expect(name).toBe('span');
  expect(attributes).toEqual([
    {
      type: 'attribute',
      name: 'one',
      value: 'uno',
      isBoolean: false,
      dynamic: true,
      reactive: false,
      expr: [{ scope: 0, value: 'uno' }],
    },
    {
      type: 'attribute',
      name: 'two',
      value: 'dos',
      isBoolean: false,
      dynamic: true,
      reactive: true,
      expr: [{ scope: 0, value: 'dos' }],
    },
  ]);
  expect(children[0].type).toBe('text');
});

test('Parse tag: with loop directive', () => {
  const loopedTag: RawTagSchema = {
    type: 'tag',
    name: 'span',
    attribs: { '(loop)': 'list', id: 'myid', '(index)': 'i', '(pos)': 'p' },
    children: [],
  };
  const parsed = parseTag(loopedTag) as LoopSchema;
  expect(parsed).toEqual({
    type: 'loop',
    target: [{ scope: 0, value: 'list' }],
    index: 'i',
    pos: 'p',
    children: [
      {
        type: 'tag',
        name: 'span',
        isVoid: false,
        ref: undefined,
        events: [],
        attributes: [
          {
            type: 'attribute',
            name: 'id',
            value: 'myid',
            isBoolean: false,
            dynamic: false,
            reactive: false,
          },
        ],
        children: [],
      },
    ],
  });
});

test('Parse tag: with conditional directive', () => {
  const ifTag: RawTagSchema = {
    type: 'tag',
    name: 'span',
    attribs: { '(if)': 'isUser', id: 'myid' },
    children: [],
  };
  const { type, target, condition, reactive, children } = parseTag(
    ifTag
  ) as CondSchema;
  expect(type).toBe('condition');
  expect(condition).toBe('if');
  expect(reactive).toBe(false);
  expect(target).toEqual([{ scope: 0, value: 'isUser' }]);
  const child = children[0] as TagSchema;
  expect(child.type).toBe('tag');
  expect(child.attributes).toEqual([
    {
      type: 'attribute',
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
  const { type, condition, target, reactive, children } = parseTag(
    multiTag
  ) as CondSchema;

  expect(type).toBe('condition');
  expect(condition).toBe('if');
  expect(reactive).toBe(false);
  expect(target).toEqual([{ scope: 0, value: 'isUser' }]);

  const loop = children[0] as LoopSchema;

  expect(loop.type).toBe('loop');
  expect(loop.target).toEqual([{ scope: 0, value: 'list' }]);
  expect(loop.index).toBe('i');
  expect(loop.pos).toBe('p');

  const child = loop.children[0] as TagSchema;
  expect(child.type).toBe('tag');
  expect(child.attributes).toEqual([
    {
      type: 'attribute',
      name: 'id',
      value: 'myid',
      isBoolean: false,
      dynamic: false,
      reactive: false,
    },
  ]);
});
