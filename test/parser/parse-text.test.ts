import { parseText } from '../../src/parser/parse-text';
import { RawTextSchema, NodeTypes } from '../../src/types';

test('Parse#text flat and empty', () => {
  const result = [];
  const parsed = parseText({
    type: 'text',
    data: '',
  });
  expect(parsed).toEqual(result);
});

test('Parse#text flat', () => {
  const schema: RawTextSchema = { type: 'text', data: 'hola mundo ' };
  const result = [
    {
      type: NodeTypes.TEXT,
      value: 'hola mundo ',
      dynamic: false,
      reactive: false,
    },
  ];
  const parsed = parseText(schema);
  expect(parsed).toEqual(result);
});

test('Parse#text dynamic', () => {
  const schema: RawTextSchema = { type: 'text', data: 'counter {{ count }}.' };
  const result = [
    {
      type: NodeTypes.TEXT,
      value: 'counter ',
      dynamic: false,
      reactive: false,
    },
    {
      type: NodeTypes.TEXT,
      value: 'count',
      dynamic: true,
      reactive: false,
      expr: [{ scope: 0, value: 'count' }],
    },
    {
      type: NodeTypes.TEXT,
      value: '.',
      dynamic: false,
      reactive: false,
    },
  ];
  const parsed = parseText(schema);
  expect(parsed).toEqual(result);
});

test('Parse#text reactive', () => {
  const schema: RawTextSchema = {
    type: 'text',
    data: 'Normal, {{ dinamico }} y {{: reactivo }}',
  };
  const result = [
    {
      type: NodeTypes.TEXT,
      value: 'Normal, ',
      dynamic: false,
      reactive: false,
    },
    {
      type: NodeTypes.TEXT,
      value: 'dinamico',
      dynamic: true,
      reactive: false,
      expr: [{ scope: 0, value: 'dinamico' }],
    },
    {
      type: NodeTypes.TEXT,
      value: ' y ',
      dynamic: false,
      reactive: false,
    },
    {
      type: NodeTypes.TEXT,
      value: 'reactivo',
      dynamic: true,
      reactive: true,
      expr: [{ scope: 0, value: 'reactivo' }],
    },
  ];
  const parsed = parseText(schema);
  expect(parsed).toEqual(result);
});
