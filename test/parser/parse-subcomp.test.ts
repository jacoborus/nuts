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
  const { type, name, attributes, children } = parseSubcomp(
    staticComp
  ) as SubCompSchema;
  expect(type).toBe('component');
  expect(name).toBe('my-tag');
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
  const { type, name, attributes, children } = parseSubcomp(
    dynamicTag
  ) as SubCompSchema;
  expect(type).toBe('component');
  expect(name).toBe('my-tag');
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

test('Parse component: with loop directive', () => {
  const loopedTag: RawTagSchema = {
    type: 'tag',
    name: 'my-tag',
    attribs: { '(loop)': 'list', id: 'myid', '(index)': 'i', '(pos)': 'p' },
    children: [],
  };
  const { type, target, index, pos, children } = parseSubcomp(
    loopedTag
  ) as LoopSchema;
  expect(type).toBe('loop');
  expect(target).toEqual([{ scope: 0, value: 'list' }]);
  expect(index).toBe('i');
  expect(pos).toBe('p');
  const child = children[0] as SubCompSchema;
  expect(child.type).toBe('component');
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

test('Parse component: with conditional directive', () => {
  const ifTag: RawTagSchema = {
    type: 'tag',
    name: 'my-tag',
    attribs: { '(if)': 'isUser', id: 'myid' },
    children: [],
  };
  const { type, target, condition, reactive, children } = parseSubcomp(
    ifTag
  ) as CondSchema;
  expect(type).toBe('condition');
  expect(condition).toBe('if');
  expect(reactive).toBe(false);
  expect(target).toEqual([{ scope: 0, value: 'isUser' }]);
  const child = children[0] as SubCompSchema;
  expect(child.type).toBe('component');
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
  const { type, condition, target, reactive, children } = parseSubcomp(
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

  const child = loop.children[0] as SubCompSchema;
  expect(child.type).toBe('component');
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
