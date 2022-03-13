import { parseText } from '../../src/parser/parse-text';
import { NodeTypes, TextSchema } from '../../src/types';
import { Reader } from '../../src/parser/reader';

test('Parse#text flat and empty', () => {
  const reader = new Reader('x', '</span>');
  const result = [];
  const parsed = parseText(reader);
  expect(parsed).toEqual(result);
});

test('Parse#text flat', () => {
  const reader = new Reader('x', 'hola mundo </span>');
  const result = [
    {
      type: NodeTypes.TEXT,
      value: 'hola mundo ',
      dynamic: false,
      reactive: false,
      start: 0,
      end: 10,
    },
  ];
  const parsed = parseText(reader);
  expect(parsed).toEqual(result);
});

test('Parse#text dynamic', () => {
  const reader = new Reader('x', 'counter {{ count }}.</span>');
  const result = [
    {
      type: NodeTypes.TEXT,
      value: 'counter ',
      dynamic: false,
      reactive: false,
      start: 0,
      end: 7,
    },
    {
      type: NodeTypes.TEXT,
      value: '{{ count }}',
      dynamic: true,
      reactive: false,
      expr: [{ scope: 0, value: 'count' }],
      start: 8,
      end: 18,
    },
    {
      type: NodeTypes.TEXT,
      value: '.',
      dynamic: false,
      reactive: false,
      start: 19,
      end: 19,
    },
  ];
  const parsed = parseText(reader);
  expect(parsed).toEqual(result);
});

test('Parse#text reactive', () => {
  const reader = new Reader(
    'x',
    'Normal, {{ dinamico }} y {{: reactivo }}</span>'
  );
  const result: TextSchema[] = [
    {
      type: NodeTypes.TEXT,
      value: 'Normal, ',
      dynamic: false,
      reactive: false,
      start: 0,
      end: 7,
    },
    {
      type: NodeTypes.TEXT,
      value: '{{ dinamico }}',
      dynamic: true,
      reactive: false,
      expr: [{ scope: 0, value: 'dinamico' }],
      start: 8,
      end: 21,
    },
    {
      type: NodeTypes.TEXT,
      value: ' y ',
      dynamic: false,
      reactive: false,
      start: 22,
      end: 24,
    },
    {
      type: NodeTypes.TEXT,
      value: '{{: reactivo }}',
      dynamic: true,
      reactive: true,
      expr: [{ scope: 0, value: 'reactivo' }],
      start: 25,
      end: 39,
    },
  ];
  const parsed = parseText(reader);
  expect(parsed).toEqual(result);
});
