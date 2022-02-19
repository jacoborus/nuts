import { compileLoop } from '../../src/compiler/compile-directive';
import { LoopSchema } from '../../src/types';

test('Compile directive #loop', () => {
  const schema = {
    type: 'loop',
    target: [{ scope: 0, value: 'list' }],
    children: [
      {
        type: 'text',
        value: 'hola',
        dynamic: false,
        reactive: false,
      },
    ],
  };
  const result =
    '${(it.list || []).map(item => {' +
    'const parent = [it], it = item;' +
    'return `hola`}).join("")}';
  const compiled = compileLoop(schema as LoopSchema);
  expect(compiled).toEqual(result);
});
