import { parseTag } from '../../src/parser/parse-tag';

const baseComp = {
  type: 'tag',
  name: 'span',
  attribs: { id: 'myid' },
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

test('Parse tag: simple', () => {
  const { kind, name, attribs, children } = parseTag(baseComp);
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

// TODO
test.skip('Parse tag: with conditional const', () => {
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
