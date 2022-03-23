import {
  parseCode,
  parseComment,
  parseLoop,
  parseScript,
  parseSubcomp,
  parseTag,
  parseTree,
} from '../../src/parser/parse-tag';
import {
  LoopSchema,
  NodeTypes,
  SubCompSchema,
  TagSchema,
  TreeSchema,
} from '../../src/types';
import { Reader } from '../../src/parser/reader';

jest.mock('../../src/parser/parse-typescript', () => {
  return {
    parseTs: () => 'x',
  };
});

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
        name: { value: 'id', start: 6, end: 7 },
        value: { value: 'myid', start: 9, end: 14 },
        isBoolean: false,
        isEvent: false,
        isDirective: false,
        dynamic: false,
        reactive: false,
        start: 6,
        end: 14,
      },
      {
        type: NodeTypes.ATTRIBUTE,
        name: { value: 'class', start: 16, end: 20 },
        value: { value: 'clase', start: 22, end: 28 },
        isBoolean: false,
        isDirective: false,
        dynamic: false,
        isEvent: false,
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

test('Parse subcomponent', () => {
  const reader = new Reader(
    'x',
    '<custom-comp id="myid" class="clase">hola</custom-comp>'
  );
  const tag = parseSubcomp(reader) as SubCompSchema;
  const result: SubCompSchema = {
    type: NodeTypes.SUBCOMPONENT,
    name: 'custom-comp',
    attributes: [
      {
        type: NodeTypes.ATTRIBUTE,
        name: { value: 'id', start: 13, end: 14 },
        value: { value: 'myid', start: 16, end: 21 },
        isBoolean: false,
        isEvent: false,
        isDirective: false,
        dynamic: false,
        reactive: false,
        expr: undefined,
        start: 13,
        end: 21,
      },
      {
        type: NodeTypes.ATTRIBUTE,
        name: { value: 'class', start: 23, end: 27 },
        value: { value: 'clase', start: 29, end: 35 },
        isBoolean: false,
        isDirective: false,
        dynamic: false,
        isEvent: false,
        expr: undefined,
        reactive: false,
        start: 23,
        end: 35,
      },
    ],
    events: [],
    children: [
      {
        type: NodeTypes.TEXT,
        value: 'hola',
        dynamic: false,
        reactive: false,
        start: 37,
        end: 40,
      },
    ],
    start: 0,
    end: 54,
  };
  expect(tag).toEqual(result);
});

test('Parse loop', () => {
  const reader = new Reader(
    'x',
    '<loop (lista) (index)="i" (pos)="p">hola</loop></div>'
  );
  const tag = parseLoop(reader) as LoopSchema;
  const result: LoopSchema = {
    type: NodeTypes.LOOP,
    target: {
      scope: 1,
      start: 6,
      end: 12,
      slabs: [
        {
          value: 'lista',
          start: 7,
          end: 11,
        },
      ],
    },
    index: 'i',
    pos: 'p',
    children: [
      {
        type: NodeTypes.TEXT,
        value: 'hola',
        dynamic: false,
        reactive: false,
        start: 36,
        end: 39,
      },
    ],
    start: 0,
    end: 46,
  };
  expect(tag).toEqual(result);
});

test('Parse tree if', () => {
  const reader = new Reader('x', '<if (isUser)>hola</if></div>');
  const tag = parseTree(reader) as TreeSchema;
  const result: TreeSchema = {
    type: NodeTypes.TREE,
    kind: 'if',
    reactive: false,
    requirement: {
      scope: 1,
      start: 4,
      end: 11,
      slabs: [
        {
          value: 'isUser',
          start: 5,
          end: 10,
        },
      ],
    },
    yes: [
      {
        type: NodeTypes.TEXT,
        value: 'hola',
        dynamic: false,
        reactive: false,
        start: 13,
        end: 16,
      },
    ],
    no: [],
    start: 0,
    end: 21,
  };
  expect(tag).toEqual(result);
});

test('Parse tree elseif', () => {
  const reader = new Reader('x', '<elseif (isUser)>hola</elseif></div>');
  const tag = parseTree(reader) as TreeSchema;
  const result: TreeSchema = {
    type: NodeTypes.TREE,
    kind: 'elseif',
    reactive: false,
    requirement: {
      scope: 1,
      start: 8,
      end: 15,
      slabs: [
        {
          value: 'isUser',
          start: 9,
          end: 14,
        },
      ],
    },
    yes: [
      {
        type: NodeTypes.TEXT,
        value: 'hola',
        dynamic: false,
        reactive: false,
        start: 17,
        end: 20,
      },
    ],
    no: [],
    start: 0,
    end: 29,
  };
  expect(tag).toEqual(result);
});

test('Parse tree else', () => {
  const reader = new Reader('x', '<else (isUser)>hola</else></div>');
  const tag = parseTree(reader) as TreeSchema;
  const result: TreeSchema = {
    type: NodeTypes.TREE,
    kind: 'else',
    reactive: false,
    requirement: undefined,
    yes: [],
    no: [
      {
        type: NodeTypes.TEXT,
        value: 'hola',
        dynamic: false,
        reactive: false,
        start: 15,
        end: 18,
      },
    ],
    start: 0,
    end: 25,
  };
  expect(tag).toEqual(result);
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
        name: { value: 'att', start: 8, end: 10 },
        value: { value: 'dos', start: 12, end: 16 },
        dynamic: false,
        reactive: false,
        isBoolean: false,
        isDirective: false,
        isEvent: false,
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

test('parseCode', () => {
  const reader = new Reader(
    'x',
    `<script att="dos">as
    df</script> `
  );
  const schema = parseCode(reader);
  expect(schema).toEqual({
    type: NodeTypes.SCRIPT,
    attributes: [
      {
        type: NodeTypes.ATTRIBUTE,
        name: { value: 'att', start: 8, end: 10 },
        value: { value: 'dos', start: 12, end: 16 },
        dynamic: false,
        reactive: false,
        isBoolean: false,
        isDirective: false,
        isEvent: false,
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
