import { tokenizeHtml } from '../src/tokenize-html';
import { TokenKind } from '../src/types';

test('tokenize: simple void element', () => {
  const tokens = tokenizeHtml('  <br>');
  expect(tokens).toEqual([
    { start: 0, end: 1, type: TokenKind.Literal, value: '  ' },
    { start: 2, end: 2, type: TokenKind.OpenTag, value: '<' },
    { start: 3, end: 4, type: TokenKind.TagName, value: 'br' },
    { start: 5, end: 5, type: TokenKind.OpenTagEnd, value: '>' },
  ]);
});

test('tokenize: tag with attribs', () => {
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

test('tokenize: tag with unquoted attribs', () => {
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
