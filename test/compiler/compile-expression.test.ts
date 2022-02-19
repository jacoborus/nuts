import { compileExpression } from '../../src/compiler/compile-expression';

test('Compile Expression #simple', () => {
  const result = 'it.uno?.["2"]?.tres';
  const expr = [
    {
      scope: 0,
      value: 'uno',
    },
    {
      scope: 0,
      value: '2',
    },
    {
      scope: 0,
      value: 'tres',
    },
  ];
  const compiled = compileExpression(expr);
  expect(compiled).toEqual(result);
});

test('Compile Expression #with parent', () => {
  const result = 'parent[0]?.uno?.[parent[1]?.dos]?.tres';
  const expr = [
    {
      scope: 1,
      value: 'uno',
    },
    {
      scope: 2,
      value: 'dos',
    },
    {
      scope: 0,
      value: 'tres',
    },
  ];
  const compiled = compileExpression(expr);
  expect(compiled).toEqual(result);
});