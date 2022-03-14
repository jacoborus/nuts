import { parseComment, parseScript } from '../../src/parser/parse-file';
import { Reader } from '../../src/parser/reader';
import { NodeTypes } from '../../src/types';

test('parseComment', () => {
  const reader = new Reader('archivo.nuts', '<!-- hola   --> ');
  const schema = parseComment(reader);
  expect(schema).toEqual({
    type: NodeTypes.COMMENT,
    value: ' hola   ',
    start: 0,
    end: 14,
  });
});

test('parseScript', () => {
  const reader = new Reader(
    'x',
    `<script att="dos">as
    df</script> `
  );
  const schema = parseScript(reader);
  expect(schema).toEqual({
    type: NodeTypes.SCRIPT,
    attributes: [
      {
        type: NodeTypes.ATTRIBUTE,
        name: 'att',
        value: 'dos',
        dynamic: false,
        reactive: false,
        isBoolean: false,
        isDirective: false,
        isEvent: false,
        expr: [],
        start: 8,
        end: 16,
      },
    ],
    value: `as
    df`,
    start: 0,
    end: 35,
  });
});
