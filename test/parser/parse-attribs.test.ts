import { parseAttribs } from '../../src/parser/parse-attribs';
import { Reader } from '../../src/parser/reader';
import { NodeTypes } from '../../src/types';

test('parse attributes: simple', () => {
  const reader = new Reader('x', `att="dos" >  `);
  const schema = parseAttribs(reader);
  expect(schema[0]).toEqual({
    type: NodeTypes.ATTRIBUTE,
    name: {
      value: 'att',
      start: 0,
      end: 2,
    },
    value: {
      value: 'dos',
      start: 4,
      end: 8,
    },
    dynamic: false,
    reactive: false,
    isDirective: false,
    isBoolean: false,
    isEvent: false,
    start: 0,
    end: 8,
  });
});

test('parse attributes: dynamic', () => {
  const reader = new Reader('x', `:att="dos">  `);
  const schema = parseAttribs(reader);
  expect(schema[0]).toEqual({
    type: NodeTypes.ATTRIBUTE,
    name: {
      value: 'att',
      start: 1,
      end: 3,
    },
    value: {
      end: 9,
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
      start: 5,
      value: 'dos',
    },
    dynamic: true,
    reactive: false,
    isDirective: false,
    isBoolean: false,
    isEvent: false,
    start: 0,
    end: 9,
  });
});

test.skip('parse attributes: reactive', () => {
  const reader = new Reader('x', `::att="dos">  `);
  const schema = parseAttribs(reader);
  expect(schema[0]).toEqual({
    type: NodeTypes.ATTRIBUTE,
    name: {
      value: 'att',
      start: 2,
      end: 4,
    },
    value: {
      value: 'dos',
      start: 6,
      end: 9,
    },
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
  const reader = new Reader('x', '(if)="dos">  ');
  const schema = parseAttribs(reader);
  expect(schema[0]).toEqual({
    type: NodeTypes.ATTRIBUTE,
    name: {
      value: 'if',
      start: 0,
      end: 3,
    },
    value: {
      value: 'dos',
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
      start: 5,
      end: 9,
    },
    dynamic: false,
    reactive: false,
    isBoolean: false,
    isDirective: true,
    isEvent: false,
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
      name: {
        value: 'lista',
        start: 0,
        end: 6,
      },
      dynamic: false,
      reactive: false,
      isBoolean: false,
      isDirective: true,
      isEvent: false,
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
      name: {
        value: 'lista',
        start: 0,
        end: 6,
      },
      dynamic: false,
      reactive: false,
      isBoolean: false,
      isDirective: true,
      isEvent: false,
      start: 0,
      end: 6,
    },
    {
      type: NodeTypes.ATTRIBUTE,
      name: {
        value: 'pos',
        start: 8,
        end: 12,
      },
      value: {
        end: 16,
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
        start: 14,
        value: 'p',
      },
      dynamic: false,
      reactive: false,
      isBoolean: false,
      isDirective: true,
      isEvent: false,
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
    name: {
      value: 'att',
      start: 0,
      end: 2,
    },
    value: {
      value: 'dos',
      start: 4,
      end: 6,
    },
    dynamic: false,
    reactive: false,
    isDirective: false,
    isBoolean: false,
    isEvent: false,
    start: 0,
    end: 6,
  });
});
