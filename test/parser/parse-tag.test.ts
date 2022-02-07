import { parseTag } from '../../src/parser/parse-tag';
import { RawTagSchema, TagSchema } from '../../src/types';

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

test.skip('Parse tag: dynamic', () => {
  const condComp = {
    type: 'tag',
    name: 'span',
    attribs: { '(if)': 'mycond' },
    children: [
      {
        type: 'text',
        data: 'hola',
      },
    ],
  };

  const { kind, name, attribs, children } = parseTag(condComp);
  expect(kind).toBe('tag');
  expect(name).toBe('span');
  expect(attribs).toEqual([
    {
      kind: 'plain',
      propName: 'id',
      value: 'myid',
      variables: [],
    },
  ]);
  expect(children[0].kind).toBe('text');
  expect(children[1].kind).toBe('nut');
});
