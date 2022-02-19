import { parseText } from '../../src/parser/parse-text';
import { RawTextSchema } from '../../src/types';

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
      type: 'text',
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
      type: 'text',
      value: 'counter ',
      dynamic: false,
      reactive: false,
    },
    {
      type: 'text',
      value: 'count',
      dynamic: true,
      reactive: false,
      expr: [{ scope: 0, value: 'count' }],
    },
    {
      type: 'text',
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
      type: 'text',
      value: 'Normal, ',
      dynamic: false,
      reactive: false,
    },
    {
      type: 'text',
      value: 'dinamico',
      dynamic: true,
      reactive: false,
      expr: [{ scope: 0, value: 'dinamico' }],
    },
    {
      type: 'text',
      value: ' y ',
      dynamic: false,
      reactive: false,
    },
    {
      type: 'text',
      value: 'reactivo',
      dynamic: true,
      reactive: true,
      expr: [{ scope: 0, value: 'reactivo' }],
    },
  ];
  const parsed = parseText(schema);
  expect(parsed).toEqual(result);
});
