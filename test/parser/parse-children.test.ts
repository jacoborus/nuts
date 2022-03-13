import { parseChildren } from '../../src/parser/parse-children';
import { Reader } from '../../src/parser/reader';
import { NodeTypes, ElemSchema } from '../../src/types';

test('Parse children: simple', () => {
  const reader = new Reader(
    'x',
    '<span>hola</span>adios<ul><li>item</li></ul></div>'
  );
  const tag = parseChildren(reader, 'div') as ElemSchema[];
  const result: ElemSchema[] = [
    {
      type: NodeTypes.TAG,
      name: 'span',
      isVoid: false,
      attributes: [],
      events: [],
      children: [
        {
          type: NodeTypes.TEXT,
          value: 'hola',
          dynamic: false,
          reactive: false,
          start: 6,
          end: 9,
        },
      ],
      start: 0,
      end: 16,
    },
    {
      type: NodeTypes.TEXT,
      value: 'adios',
      dynamic: false,
      reactive: false,
      start: 17,
      end: 21,
    },
    {
      type: NodeTypes.TAG,
      name: 'ul',
      isVoid: false,
      attributes: [],
      events: [],
      children: [
        {
          type: NodeTypes.TAG,
          name: 'li',
          isVoid: false,
          attributes: [],
          events: [],
          children: [
            {
              type: NodeTypes.TEXT,
              value: 'item',
              dynamic: false,
              reactive: false,
              start: 30,
              end: 33,
            },
          ],
          start: 26,
          end: 38,
        },
      ],
      start: 22,
      end: 43,
    },
  ];
  expect(tag).toEqual(result);
});
