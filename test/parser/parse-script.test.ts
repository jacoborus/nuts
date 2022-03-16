import { parseScript } from '../../src/parser/parse-script';
import { NodeTypes } from '../../src/types';
import { Reader } from '../../src/parser/reader';
jest.mock('@babel/parser', () => {
  return {
    parse: () => 'x',
  };
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
    ast: 'x',
    value: `as
    df`,
    start: 0,
    end: 35,
  });
});
