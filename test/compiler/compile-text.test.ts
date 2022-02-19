import { compileText } from '../../src/compiler/compile-text';
import { TextSchema } from '../../src/types';

jest.mock('../../src/compiler/compile-expression', () => {
  return {
    compileExpression: () => 'x',
  };
});

test('Compile text #simple', () => {
  const result = 'hola';
  const schema = {
    kind: 'text',
    value: 'hola',
    dynamic: false,
    reactive: false,
  };
  const compiled = compileText(schema as TextSchema);
  expect(compiled).toEqual(result);
});

test('Compile text # simple expression', () => {
  const result = '${x}';
  const schema = {
    kind: 'text',
    value: 'uno.dos',
    dynamic: true,
    reactive: false,
    expr: [
      { scope: 0, value: 'uno' },
      { scope: 0, value: 'dos' },
    ],
  };
  const compiled = compileText(schema as TextSchema);
  expect(compiled).toEqual(result);
});
