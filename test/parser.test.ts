import { parse } from '../src/parser';
import { TokenKind, NodeType } from '../src/types';

test('parser: simple text node element', () => {
  // '  <br>'
  const tokens = [
    { start: 0, end: 5, type: TokenKind.Literal, value: ' hola ' },
  ];
  const schema = [
    {
      type: NodeType.Text,
      value: ' hola ',
      start: 0,
      end: 5,
    },
  ];
  const result = parse(tokens);
  expect(result).toEqual(schema);
});

test('parser: simple text + void element', () => {
  // '  <br>'
  const tokens = [
    { start: 0, end: 1, type: TokenKind.Literal, value: '  ' },
    { start: 2, end: 2, type: TokenKind.OpenTag, value: '<' },
    { start: 3, end: 4, type: TokenKind.TagName, value: 'br' },
    { start: 5, end: 5, type: TokenKind.OpenTagEnd, value: '>' },
  ];
  const schema = [
    {
      start: 0,
      end: 1,
      type: NodeType.Text,
      value: '  ',
    },
    {
      type: NodeType.Tag,
      name: 'br',
      rawName: { start: 3, end: 4, type: TokenKind.TagName, value: 'br' },
      attributes: [],
      isVoid: true,
      events: [],
      isSubComp: false,
      close: null,
      body: null,
      start: 2,
      end: 5,
    },
  ];
  const result = parse(tokens);
  expect(result).toEqual(schema);
});
