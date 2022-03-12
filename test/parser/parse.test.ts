import { parseFile } from '../../src/parser/parse';
import { NodeTypes } from '../../src/types';

test('parseComment', () => {
  const schema = parseFile('archivo.nuts', '    <!-- hola   --> ');
  expect(schema).toEqual([
    {
      type: NodeTypes.COMMENT,
      value: ' hola   ',
      start: 4,
      end: 18,
    },
  ]);
});

test('parseScript', () => {
  const schema = parseFile(
    'archivo.nuts',
    `    <script att="dos">as
    df</script> `
  );
  expect(schema).toEqual([
    {
      type: NodeTypes.SCRIPT,
      attributes: [
        {
          type: NodeTypes.ATTRIBUTE,
          name: 'att',
          value: 'dos',
          dynamic: false,
          reactive: false,
          isBoolean: false,
          expr: [],
          start: 12,
          end: 21,
        },
      ],
      value: `as
    df`,
      start: 4,
      end: 39,
    },
  ]);
});
