import { parseAttribs } from '../../src/parser/parse-attribs';
import { Reader } from '../../src/parser/reader';
import { NodeTypes } from '../../src/types';

test('parse attributes: simple', () => {
  const reader = new Reader('x', `att="dos">  `);
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
    expr: [],
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
    expr: [
      {
        scope: 0,
        value: 'dos',
      },
    ],
    start: 0,
    end: 9,
  });
});

test('parse attributes: reactive', () => {
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
    expr: [
      {
        scope: 0,
        value: 'dos',
      },
    ],
    start: 0,
    end: 9,
  });
});
