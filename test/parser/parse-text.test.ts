import { parseText } from '../../src/parser/parse-text';
import { RawTextSchema } from '../../src/types';

test('Parse#text flat and empty', () => {
  const result = {
    kind: 'text',
    chunks: [],
  };
  const parsed = parseText({
    type: 'text',
    data: '',
  });
  expect(parsed).toEqual(result);
});

test('Parse#text flat', () => {
  const schema: RawTextSchema = { type: 'text', data: 'hola mundo ' };
  const result = {
    kind: 'text',
    chunks: [
      {
        value: 'hola mundo ',
        dynamic: false,
        reactive: false,
      },
    ],
  };
  const parsed = parseText(schema);
  expect(parsed).toEqual(result);
});

test('Parse#text dynamic', () => {
  const schema: RawTextSchema = { type: 'text', data: 'counter {{ count }}.' };
  const result = {
    kind: 'text',
    chunks: [
      {
        value: 'counter ',
        dynamic: false,
        reactive: false,
      },
      {
        value: 'count',
        dynamic: true,
        reactive: false,
      },
      {
        value: '.',
        dynamic: false,
        reactive: false,
      },
    ],
  };
  const parsed = parseText(schema);
  expect(parsed).toEqual(result);
});

test('Parse#text reactive', () => {
  const schema: RawTextSchema = {
    type: 'text',
    data: 'Normal, {{ dinamico }} y {{: reactivo }}',
  };
  const result = {
    kind: 'text',
    chunks: [
      {
        value: 'Normal, ',
        dynamic: false,
        reactive: false,
      },
      {
        value: 'dinamico',
        dynamic: true,
        reactive: false,
      },
      {
        value: ' y ',
        dynamic: false,
        reactive: false,
      },
      {
        value: 'reactivo',
        dynamic: true,
        reactive: true,
      },
    ],
  };
  const parsed = parseText(schema);
  expect(parsed).toEqual(result);
});
