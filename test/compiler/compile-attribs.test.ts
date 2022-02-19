import { compileAttribs } from '../../src/compiler/compile-attribs';
import { AttSchema } from '../../src/types';

// jest.mock('../../src/compiler/compile-expression', () => {
//   return {
//     compileExpression: (ex: Expression) => ex[0].value,
//   };
// });

const attribs = [
  {
    kind: 'attribute',
    name: 'id',
    value: 'my-id',
    isBoolean: false,
    dynamic: false,
    reactive: false,
  },
  {
    kind: 'attribute',
    name: 'alt',
    value: 'uno.dos.tres',
    isBoolean: false,
    dynamic: true,
    reactive: false,
    expr: [
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
    ],
  },
];

test('Compile text #simple', () => {
  // const result = `' id="my-id"'` + "' alt='";
  const result = '` id="my-id" alt="${it.uno?.dos?.tres??""}"`';
  const compiled = compileAttribs(attribs as AttSchema[]);
  expect(compiled).toEqual(result);
});
