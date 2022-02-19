import { compileLoop, compileTree } from '../../src/compiler/compile-directive';
import { LoopSchema, TreeSchema } from '../../src/types';

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

test('Compile directive #tree', () => {
  const schema: TreeSchema = {
    type: 'tree',
    requirement: [{ scope: 0, value: 'enter' }],
    yes: [
      {
        type: 'text',
        value: 'hola',
        dynamic: false,
        reactive: false,
      },
    ],
    no: [
      {
        type: 'text',
        value: 'adios',
        dynamic: false,
        reactive: false,
      },
    ],
  };
  const result = '${it.enter ? `hola` : `adios`}';
  const compiled = compileTree(schema as TreeSchema);
  expect(compiled).toEqual(result);
});
