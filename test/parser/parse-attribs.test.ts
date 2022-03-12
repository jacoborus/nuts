import { parseAttribs } from '../../src/parser/parse-attribs';
import { Reader } from '../../src/parser/reader';
import { NodeTypes } from '../../src/types';

test('parse attributes', () => {
  const reader = new Reader('x', `att="dos">  `);
  const schema = parseAttribs(reader);
  expect(schema[0]).toEqual({
    type: NodeTypes.ATTRIBUTE,
    name: 'att',
    value: 'dos',
    dynamic: false,
    reactive: false,
    isBoolean: false,
    isEvent: false,
    expr: [],
    start: 0,
    end: 8,
  });
});
