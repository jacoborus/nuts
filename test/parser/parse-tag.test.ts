import { parseComment, parseScript } from '../../src/parser/parse-tag';
import { parseTag } from '../../src/parser/parse-tag';
import { Reader } from '../../src/parser/reader';
import { TagSchema, NodeTypes } from '../../src/types';

test('Parse tag: static', () => {
  const reader = new Reader('x', '<span id="myid" class="clase">hola</span>');
  const tag = parseTag(reader) as TagSchema;
  const result: TagSchema = {
    type: NodeTypes.TAG,
    name: 'span',
    isVoid: false,
    isDirective: false,
    attributes: [
      {
        type: NodeTypes.ATTRIBUTE,
        name: 'id',
        value: 'myid',
        isBoolean: false,
        isEvent: false,
        isDirective: false,
        dynamic: false,
        reactive: false,
        expr: [],
        start: 6,
        end: 14,
      },
      {
        type: NodeTypes.ATTRIBUTE,
        name: 'class',
        value: 'clase',
        isBoolean: false,
        isDirective: false,
        dynamic: false,
        isEvent: false,
        expr: [],
        reactive: false,
        start: 16,
        end: 28,
      },
    ],
    events: [],
    children: [
      {
        type: NodeTypes.TEXT,
        value: 'hola',
        dynamic: false,
        reactive: false,
        start: 30,
        end: 33,
      },
    ],
    start: 0,
    end: 40,
  };
  expect(tag).toEqual(result);
});

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
