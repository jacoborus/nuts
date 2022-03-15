import { compileLoop, compileTree } from '../../src/compiler/compile-directive';
import { LoopSchema, TreeSchema, NodeTypes } from '../../src/types';

test('Compile directive #loop', () => {
  const schema = {
    type: NodeTypes.LOOP,
    target: [{ scope: 0, value: 'list' }],
    children: [
      {
        type: NodeTypes.TEXT,
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
    type: NodeTypes.TREE,
    kind: 'if',
    reactive: false,
    requirement: [{ scope: 0, value: 'enter' }],
    yes: [
      {
        type: NodeTypes.TEXT,
        value: 'hola',
        dynamic: false,
        reactive: false,
        start: 0,
        end: 0,
      },
    ],
    no: [
      {
        type: NodeTypes.TEXT,
        value: 'adios',
        dynamic: false,
        reactive: false,
        start: 0,
        end: 0,
      },
    ],
    start: 0,
    end: 0,
  };
  const result = '${it.enter ? `hola` : `adios`}';
  const compiled = compileTree(schema as TreeSchema);
  expect(compiled).toEqual(result);
});
