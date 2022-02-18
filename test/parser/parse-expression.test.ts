import { parseExpression } from '../../src/parser/parse-expression';

test('parse simple expression', () => {
  const raw = 'uno.dos.tres';
  const parsed = parseExpression(raw);
  expect(parsed).toEqual([
    {
      scope: 0,
      value: 'uno',
    },
    {
      scope: 0,
      value: 'dos',
    },
    {
      scope: 0,
      value: 'tres',
    },
  ]);
});

test('parse expression from parent scope', () => {
  const raw = '../uno.dos.tres';
  const parsed = parseExpression(raw);
  expect(parsed).toEqual([
    {
      scope: 1,
      value: 'uno',
    },
    {
      scope: 0,
      value: 'dos',
    },
    {
      scope: 0,
      value: 'tres',
    },
  ]);
});
