import { parseTag } from '../../src/parser/parse-children';
import {
  RawTagSchema,
  TagSchema,
  LoopSchema,
  TreeSchema,
  NodeTypes,
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
  expect(type).toBe(NodeTypes.TAG);
  expect(name).toBe('span');
  expect(attributes).toEqual([
    {
      type: NodeTypes.ATTRIBUTE,
      name: 'id',
      value: 'myid',
      isBoolean: false,
      dynamic: false,
      reactive: false,
    },
    {
      type: NodeTypes.ATTRIBUTE,
      name: 'class',
      value: 'clase',
      isBoolean: false,
      dynamic: false,
      reactive: false,
    },
    {
      type: NodeTypes.ATTRIBUTE,
      name: 'hidden',
      value: '',
      isBoolean: true,
      dynamic: false,
      reactive: false,
    },
  ]);
  expect(children[0].type).toBe(NodeTypes.TEXT);
  expect(children[1].type).toBe(NodeTypes.COMPONENT);
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
  expect(type).toBe(NodeTypes.TAG);
  expect(name).toBe('span');
  expect(attributes).toEqual([
    {
      type: NodeTypes.ATTRIBUTE,
      name: 'one',
      value: 'uno',
      isBoolean: false,
      dynamic: true,
      reactive: false,
      expr: [{ scope: 0, value: 'uno' }],
    },
    {
      type: NodeTypes.ATTRIBUTE,
      name: 'two',
      value: 'dos',
      isBoolean: false,
      dynamic: true,
      reactive: true,
      expr: [{ scope: 0, value: 'dos' }],
    },
  ]);
  expect(children[0].type).toBe(NodeTypes.TEXT);
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
    type: NodeTypes.LOOP,
    target: [{ scope: 0, value: 'list' }],
    index: 'i',
    pos: 'p',
    children: [
      {
        type: NodeTypes.TAG,
        name: 'span',
        isVoid: false,
        ref: undefined,
        events: [],
        attributes: [
          {
            type: NodeTypes.ATTRIBUTE,
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
  const { type, kind, requirement, reactive, yes, no } = parseTag(
    ifTag
  ) as TreeSchema;
  expect(type).toBe(NodeTypes.TREE);
  expect(kind).toBe('if');
  expect(reactive).toBe(false);
  expect(requirement).toEqual([{ scope: 0, value: 'isUser' }]);
  expect(no).toEqual([]);
  const child = yes[0] as TagSchema;
  expect(child.type).toBe(NodeTypes.TAG);
  expect(child.attributes).toEqual([
    {
      type: NodeTypes.ATTRIBUTE,
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
  const { type, kind, requirement, reactive, yes, no } = parseTag(
    multiTag
  ) as TreeSchema;

  expect(type).toBe(NodeTypes.TREE);
  expect(kind).toBe('if');
  expect(reactive).toBe(false);
  expect(requirement).toEqual([{ scope: 0, value: 'isUser' }]);

  expect(no).toEqual([]);
  const loop = yes[0] as LoopSchema;

  expect(loop.type).toBe(NodeTypes.LOOP);
  expect(loop.target).toEqual([{ scope: 0, value: 'list' }]);
  expect(loop.index).toBe('i');
  expect(loop.pos).toBe('p');

  const child = loop.children[0] as TagSchema;
  expect(child.type).toBe(NodeTypes.TAG);
  expect(child.attributes).toEqual([
    {
      type: NodeTypes.ATTRIBUTE,
      name: 'id',
      value: 'myid',
      isBoolean: false,
      dynamic: false,
      reactive: false,
    },
  ]);
});
