import { parseText } from '../../src/parser/parse-text';
import { RawTextSchema, NodeTypes } from '../../src/types';

test('Parse#text flat and empty', () => {
  const result = [];
  const parsed = parseText({
    type: 'text',
    data: '',
    start: 10,
  });
  expect(parsed).toEqual(result);
});

test('Parse#text flat', () => {
  const schema: RawTextSchema = {
    type: 'text',
    data: 'hola mundo ',
    start: 10,
  };
  const result = [
    {
      type: NodeTypes.TEXT,
      value: 'hola mundo ',
      dynamic: false,
      reactive: false,
      start: 10,
    },
  ];
  const parsed = parseText(schema);
  expect(parsed).toEqual(result);
});

test('Parse#text dynamic', () => {
  const schema: RawTextSchema = {
    type: 'text',
    data: 'counter {{ count }}.',
    start: 10,
  };
  const result = [
    {
      type: NodeTypes.TEXT,
      value: 'counter ',
      dynamic: false,
      reactive: false,
      start: 10,
    },
    {
      type: NodeTypes.TEXT,
      value: 'count',
      dynamic: true,
      reactive: false,
      expr: [{ scope: 0, value: 'count' }],
      start: 18,
    },
    {
      type: NodeTypes.TEXT,
      value: '.',
      dynamic: false,
      reactive: false,
      start: 29,
    },
  ];
  const parsed = parseText(schema);
  expect(parsed).toEqual(result);
});

test('Parse#text reactive', () => {
  const schema: RawTextSchema = {
    type: 'text',
    data: 'Normal, {{ dinamico }} y {{: reactivo }}',
    start: 10,
  };
  const result = [
    {
      type: NodeTypes.TEXT,
      value: 'Normal, ',
      dynamic: false,
      reactive: false,
      start: 10,
    },
    {
      type: NodeTypes.TEXT,
      value: 'dinamico',
      dynamic: true,
      reactive: false,
      expr: [{ scope: 0, value: 'dinamico' }],
      start: 18,
    },
    {
      type: NodeTypes.TEXT,
      value: ' y ',
      dynamic: false,
      reactive: false,
      start: 32,
    },
    {
      type: NodeTypes.TEXT,
      value: 'reactivo',
      dynamic: true,
      reactive: true,
      expr: [{ scope: 0, value: 'reactivo' }],
      start: 35,
    },
  ];
  const parsed = parseText(schema);
  expect(parsed).toEqual(result);
});
