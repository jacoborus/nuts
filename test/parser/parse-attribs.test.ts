import { parseAttribs } from '../../src/parser/parse-attribs';
import { Reader } from '../../src/parser/reader';
import { NodeTypes } from '../../src/types';

test('parse attributes: simple', () => {
  const reader = new Reader('x', `att="dos" >  `);
  const schema = parseAttribs(reader);
  expect(schema[0]).toEqual({
    type: NodeTypes.ATTRIBUTE,
    name: 'att',
    value: 'dos',
    dynamic: false,
    reactive: false,
    isDirective: false,
    isBoolean: false,
    isEvent: false,
    expr: undefined,
    start: 0,
    end: 8,
  });
});

test('parse attributes: dynamic', () => {
  const reader = new Reader('x', `:att="dos">  `);
  const schema = parseAttribs(reader);
  expect(schema[0]).toEqual({
    type: NodeTypes.ATTRIBUTE,
    name: 'att',
    value: 'dos',
    dynamic: true,
    reactive: false,
    isDirective: false,
    isBoolean: false,
    isEvent: false,
    expr: {
      scope: 1,
      start: 5,
      end: 9,
      slabs: [
        {
          value: 'dos',
          start: 6,
          end: 8,
        },
      ],
    },
    start: 0,
    end: 9,
  });
});

test.skip('parse attributes: reactive', () => {
  const reader = new Reader('x', `::att="dos">  `);
  const schema = parseAttribs(reader);
  expect(schema[0]).toEqual({
    type: NodeTypes.ATTRIBUTE,
    name: 'att',
    value: 'dos',
    isDirective: false,
    dynamic: true,
    reactive: true,
    isBoolean: false,
    isEvent: false,
    expr: [
      {
        scope: 0,
        value: 'dos',
      },
    ],
    start: 0,
    end: 10,
  });
});

test('parse attributes: directive', () => {
  const reader = new Reader('x', `(if)="dos">  `);
  const schema = parseAttribs(reader);
  expect(schema[0]).toEqual({
    type: NodeTypes.ATTRIBUTE,
    name: 'if',
    value: 'dos',
    dynamic: false,
    reactive: false,
    isBoolean: false,
    isDirective: true,
    isEvent: false,
    expr: {
      scope: 1,
      start: 5,
      end: 9,
      slabs: [
        {
          value: 'dos',
          start: 6,
          end: 8,
        },
      ],
    },
    start: 0,
    end: 9,
  });
});

test('parse attributes: simple directive target', () => {
  const reader = new Reader('x', `(lista)>  `);
  const schema = parseAttribs(reader);
  const result = [
    {
      type: NodeTypes.ATTRIBUTE,
      name: '(lista)',
      value: '',
      dynamic: false,
      reactive: false,
      isBoolean: false,
      isDirective: false,
      isEvent: false,
      expr: undefined,
      start: 0,
      end: 6,
    },
  ];
  expect(schema).toEqual(result);
});

test('parse attributes: directive target', () => {
  const reader = new Reader('x', `(lista) (pos)="p">  `);
  const schema = parseAttribs(reader);
  const result = [
    {
      type: NodeTypes.ATTRIBUTE,
      name: '(lista)',
      value: '',
      dynamic: false,
      reactive: false,
      isBoolean: false,
      isDirective: false,
      isEvent: false,
      expr: undefined,
      start: 0,
      end: 6,
    },
    {
      type: NodeTypes.ATTRIBUTE,
      name: 'pos',
      value: 'p',
      dynamic: false,
      reactive: false,
      isBoolean: false,
      isDirective: true,
      isEvent: false,
      expr: {
        scope: 1,
        start: 14,
        end: 16,
        slabs: [
          {
            value: 'p',
            start: 15,
            end: 15,
          },
        ],
      },
      start: 8,
      end: 16,
    },
  ];
  expect(schema).toEqual(result);
});

test('parse attributes: without quotes', () => {
  const reader = new Reader('x', `att=dos >  `);
  const schema = parseAttribs(reader);
  expect(schema[0]).toEqual({
    type: NodeTypes.ATTRIBUTE,
    name: 'att',
    value: 'dos',
    dynamic: false,
    reactive: false,
    isDirective: false,
    isBoolean: false,
    isEvent: false,
    expr: undefined,
    start: 0,
    end: 6,
  });
});
