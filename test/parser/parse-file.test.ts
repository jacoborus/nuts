import { Reader } from '../../src/parser/reader';
import { NodeTypes } from '../../src/types';
import { parseComment } from '../../src/parser/parse-tag';

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
