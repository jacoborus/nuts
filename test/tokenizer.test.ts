import { tokenizeHtml, tokenizeExpression } from '../src/tokenizer';
import { Reader } from '../src/reader';
import { Chars, IToken, TokenKind } from '../src/types';

test('tokenize html: simple void element', () => {
  const tokens = tokenizeHtml('  <br>');
  expect(tokens).toEqual([
    { start: 0, end: 1, type: TokenKind.Literal, value: '  ' },
    { start: 2, end: 2, type: TokenKind.OpenTag, value: '<' },
    { start: 3, end: 4, type: TokenKind.TagName, value: 'br' },
    { start: 5, end: 5, type: TokenKind.OpenTagEnd, value: '>' },
  ]);
});

test('tokenize html: comment', () => {
  const tokens = tokenizeHtml('  <!-- hola --> ');
  expect(tokens).toEqual([
    { start: 0, end: 1, type: TokenKind.Literal, value: '  ' },
    { start: 2, end: 5, type: TokenKind.OpenComment, value: '<!--' },
    { start: 6, end: 11, type: TokenKind.Comment, value: ' hola ' },
    { start: 12, end: 14, type: TokenKind.CloseComment, value: '-->' },
  ]);
});

test('tokenize html: tag with no attribs', () => {
  const tokens = tokenizeHtml('<span>hola</span>');
  expect(tokens).toEqual([
    { start: 0, end: 0, type: TokenKind.OpenTag, value: '<' },
    { start: 1, end: 4, type: TokenKind.TagName, value: 'span' },
    { start: 5, end: 5, type: TokenKind.OpenTagEnd, value: '>' },
    { start: 6, end: 9, type: TokenKind.Literal, value: 'hola' },
    { start: 10, end: 11, type: TokenKind.CloseTag, value: '</' },
    { start: 12, end: 15, type: TokenKind.TagName, value: 'span' },
    { start: 16, end: 16, type: TokenKind.CloseTagEnd, value: '>' },
  ]);
});

test('tokenize html: tag with attribs', () => {
  const tokens = tokenizeHtml('<span id="myid">hola</span>');
  expect(tokens).toEqual([
    { start: 0, end: 0, type: TokenKind.OpenTag, value: '<' },
    { start: 1, end: 4, type: TokenKind.TagName, value: 'span' },
    { start: 5, end: 5, type: TokenKind.WhiteSpace, value: ' ' },
    { start: 6, end: 7, type: TokenKind.AttrName, value: 'id' },
    { start: 8, end: 8, type: TokenKind.AttrEq, value: '=' },
    { start: 9, end: 9, type: TokenKind.DQuote, value: '"' },
    { start: 10, end: 13, type: TokenKind.AttrValue, value: 'myid' },
    { start: 14, end: 14, type: TokenKind.DQuote, value: '"' },
    { start: 15, end: 15, type: TokenKind.OpenTagEnd, value: '>' },
    { start: 16, end: 19, type: TokenKind.Literal, value: 'hola' },
    { start: 20, end: 21, type: TokenKind.CloseTag, value: '</' },
    { start: 22, end: 25, type: TokenKind.TagName, value: 'span' },
    { start: 26, end: 26, type: TokenKind.CloseTagEnd, value: '>' },
  ]);
});

test('tokenize html: script', () => {
  const tokens = tokenizeHtml(`  <script lang="ts">;
    console.log('hola');</script> `);
  expect(tokens).toEqual([
    { start: 0, end: 1, type: TokenKind.Literal, value: '  ' },
    { start: 2, end: 2, type: TokenKind.OpenTag, value: '<' },
    { start: 3, end: 8, type: TokenKind.TagName, value: 'script' },
    { start: 9, end: 9, type: TokenKind.WhiteSpace, value: ' ' },
    { start: 10, end: 13, type: TokenKind.AttrName, value: 'lang' },
    { start: 14, end: 14, type: TokenKind.AttrEq, value: '=' },
    { start: 15, end: 15, type: TokenKind.DQuote, value: '"' },
    { start: 16, end: 17, type: TokenKind.AttrValue, value: 'ts' },
    { start: 18, end: 18, type: TokenKind.DQuote, value: '"' },
    { start: 19, end: 19, type: TokenKind.OpenTagEnd, value: '>' },
    {
      start: 20,
      end: 45,
      type: TokenKind.Literal,
      value: `;
    console.log('hola');`,
    },
    { start: 46, end: 47, type: TokenKind.CloseTag, value: '</' },
    { start: 48, end: 53, type: TokenKind.TagName, value: 'script' },
    { start: 54, end: 54, type: TokenKind.CloseTagEnd, value: '>' },
  ]);
});

test('tokenize html: style', () => {
  const tokens = tokenizeHtml(`  <style lang="scss">
    body{color:#fff;}</style> `);
  expect(tokens).toEqual([
    { start: 0, end: 1, type: TokenKind.Literal, value: '  ' },
    { start: 2, end: 2, type: TokenKind.OpenTag, value: '<' },
    { start: 3, end: 7, type: TokenKind.TagName, value: 'style' },
    { start: 8, end: 8, type: TokenKind.WhiteSpace, value: ' ' },
    { start: 9, end: 12, type: TokenKind.AttrName, value: 'lang' },
    { start: 13, end: 13, type: TokenKind.AttrEq, value: '=' },
    { start: 14, end: 14, type: TokenKind.DQuote, value: '"' },
    { start: 15, end: 18, type: TokenKind.AttrValue, value: 'scss' },
    { start: 19, end: 19, type: TokenKind.DQuote, value: '"' },
    { start: 20, end: 20, type: TokenKind.OpenTagEnd, value: '>' },
    {
      start: 21,
      end: 42,
      type: TokenKind.Literal,
      value: `
    body{color:#fff;}`,
    },
    { start: 43, end: 44, type: TokenKind.CloseTag, value: '</' },
    { start: 45, end: 49, type: TokenKind.TagName, value: 'style' },
    { start: 50, end: 50, type: TokenKind.CloseTagEnd, value: '>' },
  ]);
});

test('tokenize html: tag with unquoted attribs', () => {
  const tokens = tokenizeHtml('<span id=myid>hola</span>');
  expect(tokens).toEqual([
    { start: 0, end: 0, type: TokenKind.OpenTag, value: '<' },
    { start: 1, end: 4, type: TokenKind.TagName, value: 'span' },
    { start: 5, end: 5, type: TokenKind.WhiteSpace, value: ' ' },
    { start: 6, end: 7, type: TokenKind.AttrName, value: 'id' },
    { start: 8, end: 8, type: TokenKind.AttrEq, value: '=' },
    { start: 9, end: 12, type: TokenKind.AttrValue, value: 'myid' },
    { start: 13, end: 13, type: TokenKind.OpenTagEnd, value: '>' },
    { start: 14, end: 17, type: TokenKind.Literal, value: 'hola' },
    { start: 18, end: 19, type: TokenKind.CloseTag, value: '</' },
    { start: 20, end: 23, type: TokenKind.TagName, value: 'span' },
    { start: 24, end: 24, type: TokenKind.CloseTagEnd, value: '>' },
  ]);
});

test('tokenize html tag with prefixed attrib name', () => {
  const tokens = tokenizeHtml('<span :id="@user.id"/>');
  expect(tokens).toEqual([
    { start: 0, end: 0, type: TokenKind.OpenTag, value: '<' },
    { start: 1, end: 4, type: TokenKind.TagName, value: 'span' },
    { start: 5, end: 5, type: TokenKind.WhiteSpace, value: ' ' },
    { start: 6, end: 6, type: TokenKind.AttrPrefix, value: ':' },
    { start: 7, end: 8, type: TokenKind.AttrName, value: 'id' },
    { start: 9, end: 9, type: TokenKind.AttrEq, value: '=' },
    { start: 10, end: 10, type: TokenKind.DQuote, value: '"' },
    { start: 11, end: 11, type: TokenKind.FuncPrefix, value: '@' },
    { start: 12, end: 15, type: TokenKind.Identifier, value: 'user' },
    { start: 16, end: 16, type: TokenKind.Dot, value: '.' },
    { start: 17, end: 18, type: TokenKind.Identifier, value: 'id' },
    { start: 19, end: 19, type: TokenKind.DQuote, value: '"' },
    { start: 20, end: 21, type: TokenKind.VoidTagEnd, value: '/>' },
  ]);
});

test('tokenize html tag with (if) directive', () => {
  const tokens = tokenizeHtml('<span (if)="data.users"/>');
  expect(tokens).toEqual([
    { start: 0, end: 0, type: TokenKind.OpenTag, value: '<' },
    { start: 1, end: 4, type: TokenKind.TagName, value: 'span' },
    { start: 5, end: 5, type: TokenKind.WhiteSpace, value: ' ' },
    { start: 6, end: 6, type: TokenKind.OpenParens, value: '(' },
    { start: 7, end: 8, type: TokenKind.Directive, value: 'if' },
    { start: 9, end: 9, type: TokenKind.CloseParens, value: ')' },
    { start: 10, end: 10, type: TokenKind.AttrEq, value: '=' },
    { start: 11, end: 11, type: TokenKind.DQuote, value: '"' },
    { start: 12, end: 15, type: TokenKind.Identifier, value: 'data' },
    { start: 16, end: 16, type: TokenKind.Dot, value: '.' },
    { start: 17, end: 21, type: TokenKind.Identifier, value: 'users' },
    { start: 22, end: 22, type: TokenKind.DQuote, value: '"' },
    { start: 23, end: 24, type: TokenKind.VoidTagEnd, value: '/>' },
  ]);
});

test('tokenize html tag with (loop) directive', () => {
  const tokens = tokenizeHtml('<span (loop)="data.users as user, i"/>');
  expect(tokens).toEqual([
    { start: 0, end: 0, type: TokenKind.OpenTag, value: '<' },
    { start: 1, end: 4, type: TokenKind.TagName, value: 'span' },
    { start: 5, end: 5, type: TokenKind.WhiteSpace, value: ' ' },
    { start: 6, end: 6, type: TokenKind.OpenParens, value: '(' },
    { start: 7, end: 10, type: TokenKind.Directive, value: 'loop' },
    { start: 11, end: 11, type: TokenKind.CloseParens, value: ')' },
    { start: 12, end: 12, type: TokenKind.AttrEq, value: '=' },
    { start: 13, end: 13, type: TokenKind.DQuote, value: '"' },
    { start: 14, end: 17, type: TokenKind.Identifier, value: 'data' },
    { start: 18, end: 18, type: TokenKind.Dot, value: '.' },
    { start: 19, end: 23, type: TokenKind.Identifier, value: 'users' },
    { start: 24, end: 24, type: TokenKind.WhiteSpace, value: ' ' },
    { start: 25, end: 26, type: TokenKind.Identifier, value: 'as' },
    { start: 27, end: 27, type: TokenKind.WhiteSpace, value: ' ' },
    { start: 28, end: 31, type: TokenKind.Identifier, value: 'user' },
    { start: 32, end: 32, type: TokenKind.Comma, value: ',' },
    { start: 33, end: 33, type: TokenKind.WhiteSpace, value: ' ' },
    { start: 34, end: 34, type: TokenKind.Identifier, value: 'i' },
    { start: 35, end: 35, type: TokenKind.DQuote, value: '"' },
    { start: 36, end: 37, type: TokenKind.VoidTagEnd, value: '/>' },
  ]);
});

test('tokenize expression: simple expression', () => {
  const reader = new Reader('   uno.dos}');
  tokenizeExpression(reader, Chars.Cx);
  const tokens = reader.tokens.concat(reader.lastToken as IToken);
  expect(tokens).toEqual([
    { start: 0, end: 2, type: TokenKind.WhiteSpace, value: '   ' },
    { start: 3, end: 5, type: TokenKind.Identifier, value: 'uno' },
    { start: 6, end: 6, type: TokenKind.Dot, value: '.' },
    { start: 7, end: 9, type: TokenKind.Identifier, value: 'dos' },
  ]);
});

test('tokenize expression: simple expression no closer', () => {
  const reader = new Reader('uno.dos asdf');
  tokenizeExpression(reader);
  const tokens = reader.tokens.concat(reader.lastToken as IToken);
  expect(tokens).toEqual([
    { start: 0, end: 2, type: TokenKind.Identifier, value: 'uno' },
    { start: 3, end: 3, type: TokenKind.Dot, value: '.' },
    { start: 4, end: 6, type: TokenKind.Identifier, value: 'dos' },
  ]);
});

test('tokenize expression: func prefix', () => {
  const reader = new Reader('@uno.dos ');
  tokenizeExpression(reader);
  const tokens = reader.tokens.concat(reader.lastToken as IToken);
  expect(tokens).toEqual([
    { start: 0, end: 0, type: TokenKind.FuncPrefix, value: '@' },
    { start: 1, end: 3, type: TokenKind.Identifier, value: 'uno' },
    { start: 4, end: 4, type: TokenKind.Dot, value: '.' },
    { start: 5, end: 7, type: TokenKind.Identifier, value: 'dos' },
  ]);
});

test('tokenize expression: ctx prefix', () => {
  const reader = new Reader('$uno.dos ');
  tokenizeExpression(reader);
  const tokens = reader.tokens.concat(reader.lastToken as IToken);
  expect(tokens).toEqual([
    { start: 0, end: 0, type: TokenKind.CtxPrefix, value: '$' },
    { start: 1, end: 3, type: TokenKind.Identifier, value: 'uno' },
    { start: 4, end: 4, type: TokenKind.Dot, value: '.' },
    { start: 5, end: 7, type: TokenKind.Identifier, value: 'dos' },
  ]);
});

test('tokenize expression: call function', () => {
  const reader = new Reader('@uno(dos.a,  dos.b) }');
  tokenizeExpression(reader, Chars.Cx);
  const tokens = reader.tokens.concat(reader.lastToken as IToken);
  expect(tokens).toEqual([
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
  ]);
});

test('tokenize expression: subexpression', () => {
  const reader = new Reader('uno.2.[ dos.tres] }');
  tokenizeExpression(reader, Chars.Cx);
  const tokens = reader.tokens.concat(reader.lastToken as IToken);
  expect(tokens).toEqual([
    { start: 0, end: 2, type: TokenKind.Identifier, value: 'uno' },
    { start: 3, end: 3, type: TokenKind.Dot, value: '.' },
    { start: 4, end: 4, type: TokenKind.Identifier, value: '2' },
    { start: 5, end: 5, type: TokenKind.Dot, value: '.' },
    { start: 6, end: 6, type: TokenKind.OpenBracket, value: '[' },
    { start: 7, end: 7, type: TokenKind.WhiteSpace, value: ' ' },
    { start: 8, end: 10, type: TokenKind.Identifier, value: 'dos' },
    { start: 11, end: 11, type: TokenKind.Dot, value: '.' },
    { start: 12, end: 15, type: TokenKind.Identifier, value: 'tres' },
    { start: 16, end: 16, type: TokenKind.CloseBracket, value: ']' },
    { start: 17, end: 17, type: TokenKind.WhiteSpace, value: ' ' },
  ]);
});

test('tokenize expression: quoted', () => {
  const reader = new Reader("uno.2.'first name'}");
  tokenizeExpression(reader, Chars.Cx);
  const tokens = reader.tokens.concat(reader.lastToken as IToken);
  expect(tokens).toEqual([
    { start: 0, end: 2, type: TokenKind.Identifier, value: 'uno' },
    { start: 3, end: 3, type: TokenKind.Dot, value: '.' },
    { start: 4, end: 4, type: TokenKind.Identifier, value: '2' },
    { start: 5, end: 5, type: TokenKind.Dot, value: '.' },
    { start: 6, end: 6, type: TokenKind.SQuote, value: "'" },
    { start: 7, end: 16, type: TokenKind.Identifier, value: 'first name' },
    { start: 17, end: 17, type: TokenKind.SQuote, value: "'" },
  ]);
});
