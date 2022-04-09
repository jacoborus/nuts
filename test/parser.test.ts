import { parse, Reader } from '../src/parser';
import { TokenKind, NodeType } from '../src/types';

test('parser: simple text node element', () => {
  // '  hola'
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
  const result = parse(new Reader(tokens));
  expect(result).toEqual(schema);
});

test('parser: simple text + void tag', () => {
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
  const result = parse(new Reader(tokens));
  expect(result).toEqual(schema);
});

test('parser: simple tag + simple text', () => {
  // '<span>hola</span>'
  const tokens = [
    { start: 0, end: 0, type: TokenKind.OpenTag, value: '<' },
    { start: 1, end: 4, type: TokenKind.TagName, value: 'span' },
    { start: 5, end: 5, type: TokenKind.OpenTagEnd, value: '>' },
    { start: 6, end: 9, type: TokenKind.Literal, value: 'hola' },
    { start: 10, end: 16, type: TokenKind.CloseTag, value: '</span>' },
  ];
  const schema = [
    {
      type: NodeType.Tag,
      name: 'span',
      rawName: { start: 1, end: 4, type: TokenKind.TagName, value: 'span' },
      attributes: [],
      isVoid: false,
      events: [],
      isSubComp: false,
      body: [
        {
          start: 6,
          end: 9,
          type: NodeType.Text,
          value: 'hola',
        },
      ],
      start: 0,
      end: 16,
    },
  ];
  const result = parse(new Reader(tokens));
  expect(result).toEqual(schema);
});

test('parser: void tag with regular attributes + void tag', () => {
  // '<input type="text" id="myid"><br>'
  const tokens = [
    { start: 0, end: 0, type: TokenKind.OpenTag, value: '<' },
    { start: 1, end: 5, type: TokenKind.TagName, value: 'input' },
    { start: 6, end: 6, type: TokenKind.WhiteSpace, value: ' ' },
    { start: 7, end: 10, type: TokenKind.AttrName, value: 'type' },
    { start: 11, end: 11, type: TokenKind.AttrEq, value: '=' },
    { start: 12, end: 12, type: TokenKind.DQuote, value: '"' },
    { start: 13, end: 16, type: TokenKind.AttrValue, value: 'text' },
    { start: 17, end: 17, type: TokenKind.DQuote, value: '"' },
    { start: 18, end: 18, type: TokenKind.WhiteSpace, value: ' ' },
    { start: 19, end: 20, type: TokenKind.AttrName, value: 'id' },
    { start: 21, end: 21, type: TokenKind.AttrEq, value: '=' },
    { start: 22, end: 22, type: TokenKind.DQuote, value: '"' },
    { start: 23, end: 26, type: TokenKind.AttrValue, value: 'myid' },
    { start: 27, end: 27, type: TokenKind.DQuote, value: '"' },
    { start: 28, end: 28, type: TokenKind.OpenTagEnd, value: '>' },
    { start: 29, end: 29, type: TokenKind.OpenTag, value: '<' },
    { start: 30, end: 31, type: TokenKind.TagName, value: 'br' },
    { start: 32, end: 32, type: TokenKind.OpenTagEnd, value: '>' },
  ];
  const schema = [
    {
      type: NodeType.Tag,
      name: 'input',
      rawName: { start: 1, end: 5, type: TokenKind.TagName, value: 'input' },
      attributes: [
        {
          type: NodeType.Attr,
          name: { start: 7, end: 10, type: TokenKind.AttrName, value: 'type' },
          value: {
            start: 13,
            end: 16,
            type: TokenKind.AttrValue,
            value: 'text',
          },
          isBoolean: false,
          start: 7,
          end: 17,
        },
        {
          type: NodeType.Attr,
          name: { start: 19, end: 20, type: TokenKind.AttrName, value: 'id' },
          value: {
            start: 23,
            end: 26,
            type: TokenKind.AttrValue,
            value: 'myid',
          },
          isBoolean: false,
          start: 19,
          end: 27,
        },
      ],
      isVoid: true,
      events: [],
      isSubComp: false,
      body: null,
      close: null,
      start: 0,
      end: 28,
    },
    {
      type: NodeType.Tag,
      name: 'br',
      rawName: { start: 30, end: 31, type: TokenKind.TagName, value: 'br' },
      attributes: [],
      isVoid: true,
      events: [],
      isSubComp: false,
      close: null,
      body: null,
      start: 29,
      end: 32,
    },
  ];
  const result = parse(new Reader(tokens));
  expect(result).toEqual(schema);
});
