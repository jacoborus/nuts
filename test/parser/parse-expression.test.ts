import { parseExpression } from '../../src/parser/parse-expression';
import { Reader } from '../../src/parser/reader';

test('parse simple expression', () => {
  const reader = new Reader('', '{  uno.dos.tres}');
  const parsed = parseExpression(reader);
  expect(parsed).toEqual({
    scope: 1,
    start: 0,
    end: 15,
    slabs: [
      {
        value: 'uno',
        start: 3,
        end: 5,
      },
      {
        value: 'dos',
        start: 7,
        end: 9,
      },
      {
        value: 'tres',
        start: 11,
        end: 14,
      },
    ],
  });
});

test('parse expression from parent scope', () => {
  const reader = new Reader('', '{../uno.dos.tres }');
  const parsed = parseExpression(reader);
  expect(parsed).toEqual({
    scope: 2,
    start: 0,
    end: 17,
    slabs: [
      {
        value: 'uno',
        start: 4,
        end: 6,
      },
      {
        value: 'dos',
        start: 8,
        end: 10,
      },
      {
        value: 'tres',
        start: 12,
        end: 15,
      },
    ],
  });
});

test('parse subexpressions', () => {
  const raw = '{ uno.[dos].tres }';
  const reader = new Reader('', raw);
  const parsed = parseExpression(reader);
  expect(parsed).toEqual({
    scope: 1,
    start: 0,
    end: 17,
    slabs: [
      {
        value: 'uno',
        start: 2,
        end: 4,
      },
      {
        scope: 1,
        slabs: [
          {
            value: 'dos',
            start: 7,
            end: 9,
          },
        ],
        start: 6,
        end: 10,
      },
      {
        value: 'tres',
        start: 12,
        end: 15,
      },
    ],
  });
});

test('parse subexpressions from parent scope', () => {
  const raw = '{ uno.[../dos].tres }';
  const reader = new Reader('', raw);
  const parsed = parseExpression(reader);
  expect(parsed).toEqual({
    scope: 1,
    start: 0,
    end: 20,
    slabs: [
      {
        value: 'uno',
        start: 2,
        end: 4,
      },
      {
        scope: 2,
        slabs: [
          {
            value: 'dos',
            start: 10,
            end: 12,
          },
        ],
        start: 6,
        end: 13,
      },
      {
        value: 'tres',
        start: 15,
        end: 18,
      },
    ],
  });
});
