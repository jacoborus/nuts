import { parseDirective } from '../../src/parser/parse-directive';

import { RawTagSchema, LoopSchema, CondSchema } from '../../src/types';

test('Parse directive: loop', () => {
  const loopTag: RawTagSchema = {
    type: 'tag',
    name: 'loop',
    attribs: { '(list)': '', '(index)': 'i', '(pos)': 'p' },
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
  const { kind, target, index, pos, children } = parseDirective(
    loopTag
  ) as LoopSchema;
  expect(kind).toBe('loop');
  expect(target).toBe('list');
  expect(index).toBe('i');
  expect(pos).toBe('p');
  expect(children[0].kind).toBe('text');
  expect(children[1].kind).toBe('component');
});

test('Parse conditional: if', () => {
  const loopTag: RawTagSchema = {
    type: 'tag',
    name: 'if',
    attribs: { '(index)': 'i', '(isTrue)': '', '(pos)': 'p' },
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
  const { kind, target, condition, reactive, children } = parseDirective(
    loopTag
  ) as CondSchema;
  expect(kind).toBe('condition');
  expect(condition).toBe('if');
  expect(target).toBe('isTrue');
  expect(reactive).toBe(false);
  expect(children[0].kind).toBe('text');
  expect(children[1].kind).toBe('component');
});
