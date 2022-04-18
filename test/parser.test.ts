import { parse, parseExpression, Reader } from '../src/parser';
import { TokenKind, NodeType, ExprScope } from '../src/types';

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

test('parser: void tag with dynamic attributes', () => {
  // '<input :id="myid">'
  const tokens = [
    { start: 0, end: 0, type: TokenKind.OpenTag, value: '<' },
    { start: 1, end: 5, type: TokenKind.TagName, value: 'input' },
    { start: 6, end: 6, type: TokenKind.WhiteSpace, value: ' ' },
    { start: 7, end: 7, type: TokenKind.AttrPrefix, value: ':' },
    { start: 8, end: 9, type: TokenKind.AttrName, value: 'id' },
    { start: 10, end: 10, type: TokenKind.AttrEq, value: '=' },
    { start: 11, end: 11, type: TokenKind.DQuote, value: '"' },
    { start: 12, end: 15, type: TokenKind.Identifier, value: 'myid' },
    { start: 16, end: 16, type: TokenKind.DQuote, value: '"' },
    { start: 17, end: 17, type: TokenKind.OpenTagEnd, value: '>' },
  ];
  const schema = [
    {
      type: NodeType.Tag,
      name: 'input',
      rawName: { start: 1, end: 5, type: TokenKind.TagName, value: 'input' },
      attributes: [
        {
          type: NodeType.AttrDyn,
          name: { start: 8, end: 9, type: TokenKind.AttrName, value: 'id' },
          expr: {
            start: 12,
            end: 16,
            scope: ExprScope.Scope,
            slabs: [
              { start: 12, end: 15, type: TokenKind.Identifier, value: 'myid' },
            ],
          },
          isBoolean: false,
          isReactive: false,
          start: 7,
          end: 16,
        },
      ],
      isVoid: true,
      events: [],
      isSubComp: false,
      body: null,
      close: null,
      start: 0,
      end: 17,
    },
  ];
  const result = parse(new Reader(tokens));
  expect(result).toEqual(schema);
});

test('parse expression: simple expression', () => {
  // '   uno.dos'
  const tokens = [
    { start: 0, end: 2, type: TokenKind.WhiteSpace, value: '   ' },
    { start: 3, end: 5, type: TokenKind.Identifier, value: 'uno' },
    { start: 6, end: 6, type: TokenKind.Dot, value: '.' },
    { start: 7, end: 9, type: TokenKind.Identifier, value: 'dos' },
  ];
  const schema = {
    scope: ExprScope.Scope,
    start: 3,
    end: 9,
    slabs: [
      { start: 3, end: 5, type: TokenKind.Identifier, value: 'uno' },
      { start: 7, end: 9, type: TokenKind.Identifier, value: 'dos' },
    ],
  };
  const result = parseExpression(new Reader(tokens));
  expect(result).toEqual(schema);
});

test('tokenize expression: func prefix', () => {
  //'@uno.dos '
  const tokens = [
    { start: 0, end: 0, type: TokenKind.FuncPrefix, value: '@' },
    { start: 1, end: 3, type: TokenKind.Identifier, value: 'uno' },
    { start: 4, end: 4, type: TokenKind.Dot, value: '.' },
    { start: 5, end: 7, type: TokenKind.Identifier, value: 'dos' },
  ];
  const schema = {
    scope: ExprScope.Func,
    start: 0,
    end: 7,
    slabs: [
      { start: 1, end: 3, type: TokenKind.Identifier, value: 'uno' },
      { start: 5, end: 7, type: TokenKind.Identifier, value: 'dos' },
    ],
  };
  const result = parseExpression(new Reader(tokens));
  expect(result).toEqual(schema);
});

test('tokenize expression: ctx prefix', () => {
  // '$uno.dos '
  const tokens = [
    { start: 0, end: 0, type: TokenKind.CtxPrefix, value: '$' },
    { start: 1, end: 3, type: TokenKind.Identifier, value: 'uno' },
    { start: 4, end: 4, type: TokenKind.Dot, value: '.' },
    { start: 5, end: 7, type: TokenKind.Identifier, value: 'dos' },
  ];
  const schema = {
    scope: ExprScope.Ctx,
    start: 0,
    end: 7,
    slabs: [
      { start: 1, end: 3, type: TokenKind.Identifier, value: 'uno' },
      { start: 5, end: 7, type: TokenKind.Identifier, value: 'dos' },
    ],
  };
  const result = parseExpression(new Reader(tokens));
  expect(result).toEqual(schema);
});

test('tokenize expression: single subexpression', () => {
  // 'uno.2.[ $dos.tres] '
  const tokens = [
    { start: 0, end: 2, type: TokenKind.Identifier, value: 'uno' },
    { start: 3, end: 3, type: TokenKind.Dot, value: '.' },
    { start: 4, end: 4, type: TokenKind.Identifier, value: '2' },
    { start: 5, end: 5, type: TokenKind.Dot, value: '.' },
    { start: 6, end: 6, type: TokenKind.OpenBracket, value: '[' },
    { start: 7, end: 7, type: TokenKind.WhiteSpace, value: ' ' },
    { start: 8, end: 8, type: TokenKind.CtxPrefix, value: '$' },
    { start: 9, end: 11, type: TokenKind.Identifier, value: 'dos' },
    { start: 12, end: 12, type: TokenKind.Dot, value: '.' },
    { start: 13, end: 16, type: TokenKind.Identifier, value: 'tres' },
    { start: 17, end: 17, type: TokenKind.CloseBracket, value: ']' },
    // { start: 18, end: 18, type: TokenKind.WhiteSpace, value: ' ' },
  ];
  const schema = {
    scope: ExprScope.Scope,
    start: 0,
    end: 17,
    slabs: [
      { start: 0, end: 2, type: TokenKind.Identifier, value: 'uno' },
      { start: 4, end: 4, type: TokenKind.Identifier, value: '2' },
      {
        scope: ExprScope.Ctx,
        start: 8,
        end: 17,
        slabs: [
          { start: 9, end: 11, type: TokenKind.Identifier, value: 'dos' },
          { start: 13, end: 16, type: TokenKind.Identifier, value: 'tres' },
        ],
      },
    ],
  };
  const result = parseExpression(new Reader(tokens));
  expect(result).toEqual(schema);
});

test.skip('tokenize expression: multiple subexpression', () => {
  // '{uno.2.{ $dos.tres}.{foo}} '
  const tokens = [
    { start: 0, end: 2, type: TokenKind.Identifier, value: 'uno' },
    { start: 3, end: 3, type: TokenKind.Dot, value: '.' },
    { start: 4, end: 4, type: TokenKind.Identifier, value: '2' },
    { start: 5, end: 5, type: TokenKind.Dot, value: '.' },
    { start: 6, end: 6, type: TokenKind.OpenBracket, value: '[' },
    { start: 7, end: 7, type: TokenKind.WhiteSpace, value: ' ' },
    { start: 8, end: 8, type: TokenKind.CtxPrefix, value: '$' },
    { start: 9, end: 11, type: TokenKind.Identifier, value: 'dos' },
    { start: 12, end: 12, type: TokenKind.Dot, value: '.' },
    { start: 13, end: 16, type: TokenKind.Identifier, value: 'tres' },
    { start: 17, end: 17, type: TokenKind.CloseBracket, value: ']' },
    { start: 18, end: 18, type: TokenKind.Dot, value: '.' },
    { start: 19, end: 19, type: TokenKind.OpenBracket, value: '[' },
    { start: 20, end: 22, type: TokenKind.Identifier, value: 'foo' },
    { start: 23, end: 23, type: TokenKind.CloseBracket, value: ']' },
    // { start: 18, end: 18, type: TokenKind.WhiteSpace, value: ' ' },
  ];
  const schema = {
    scope: ExprScope.Scope,
    start: 0,
    end: 23,
    slabs: [
      { start: 0, end: 2, type: TokenKind.Identifier, value: 'uno' },
      { start: 4, end: 4, type: TokenKind.Identifier, value: '2' },
      {
        scope: ExprScope.Ctx,
        start: 8,
        end: 17,
        slabs: [
          { start: 9, end: 11, type: TokenKind.Identifier, value: 'dos' },
          { start: 13, end: 16, type: TokenKind.Identifier, value: 'tres' },
        ],
      },
      {
        scope: ExprScope.Scope,
        start: 19,
        end: 23,
        slabs: [
          { start: 20, end: 22, type: TokenKind.Identifier, value: 'foo' },
        ],
      },
    ],
  };
  const result = parseExpression(new Reader(tokens));
  // console.log(result);
  expect(result).toEqual(schema);
});

test.skip('tokenize expression: call function', () => {
  // '@uno(dos.a,  dos.b) }'
  const tokens = [
    { start: 0, end: 0, type: TokenKind.FuncPrefix, value: '@' },
    { start: 1, end: 3, type: TokenKind.Identifier, value: 'uno' },
    { start: 4, end: 4, type: TokenKind.OpenParens, value: '(' },
    { start: 5, end: 7, type: TokenKind.Identifier, value: 'dos' },
    { start: 8, end: 8, type: TokenKind.Dot, value: '.' },
    { start: 9, end: 9, type: TokenKind.Identifier, value: 'a' },
    { start: 10, end: 10, type: TokenKind.Comma, value: ',' },
    { start: 11, end: 12, type: TokenKind.WhiteSpace, value: '  ' },
    { start: 13, end: 15, type: TokenKind.Identifier, value: 'dos' },
    { start: 16, end: 16, type: TokenKind.Dot, value: '.' },
    { start: 17, end: 17, type: TokenKind.Identifier, value: 'b' },
    { start: 18, end: 18, type: TokenKind.CloseParens, value: ')' },
    { start: 19, end: 19, type: TokenKind.WhiteSpace, value: ' ' },
  ];
  const schema = {
    scope: 0,
    start: 3,
    end: 9,
    slabs: [
      { start: 3, end: 5, type: TokenKind.Identifier, value: 'uno' },
      { start: 7, end: 9, type: TokenKind.Identifier, value: 'dos' },
    ],
  };
  const result = parseExpression(new Reader(tokens));
  expect(result).toEqual(schema);
});

test.skip('tokenize expression: quoted', () => {
  // "uno.2.'first name'"
  const tokens = [
    { start: 0, end: 2, type: TokenKind.Identifier, value: 'uno' },
    { start: 3, end: 3, type: TokenKind.Dot, value: '.' },
    { start: 4, end: 4, type: TokenKind.Identifier, value: '2' },
    { start: 5, end: 5, type: TokenKind.Dot, value: '.' },
    { start: 6, end: 6, type: TokenKind.SQuote, value: "'" },
    { start: 7, end: 16, type: TokenKind.Identifier, value: 'first name' },
    { start: 17, end: 17, type: TokenKind.SQuote, value: "'" },
  ];
  const schema = {
    scope: 0,
    start: 3,
    end: 9,
    slabs: [
      { start: 3, end: 5, type: TokenKind.Identifier, value: 'uno' },
      { start: 7, end: 9, type: TokenKind.Identifier, value: 'dos' },
    ],
  };
  const result = parseExpression(new Reader(tokens));
  expect(result).toEqual(schema);
});
