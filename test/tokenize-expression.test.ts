import { tokenizeExpression } from '../src/tokenize-expression';
import { TokenKind } from '../src/types';

test('tokenize: simple expression', () => {
  const tokens = tokenizeExpression('   uno.dos}', '}');
  expect(tokens).toEqual([
    { start: 0, end: 2, type: TokenKind.WhiteSpace, value: '   ' },
    { start: 3, end: 5, type: TokenKind.Identifier, value: 'uno' },
    { start: 6, end: 6, type: TokenKind.Dot, value: '.' },
    { start: 7, end: 9, type: TokenKind.Identifier, value: 'dos' },
  ]);
});

test('tokenize: simple expression no closer', () => {
  const tokens = tokenizeExpression('uno.dos asdf');
  expect(tokens).toEqual([
    { start: 0, end: 2, type: TokenKind.Identifier, value: 'uno' },
    { start: 3, end: 3, type: TokenKind.Dot, value: '.' },
    { start: 4, end: 6, type: TokenKind.Identifier, value: 'dos' },
  ]);
});

test('tokenize: func prefix', () => {
  const tokens = tokenizeExpression('@uno.dos');
  expect(tokens).toEqual([
    { start: 0, end: 0, type: TokenKind.FuncPrefix, value: '@' },
    { start: 1, end: 3, type: TokenKind.Identifier, value: 'uno' },
    { start: 4, end: 4, type: TokenKind.Dot, value: '.' },
    { start: 5, end: 7, type: TokenKind.Identifier, value: 'dos' },
  ]);
});

test('tokenize: ctx prefix', () => {
  const tokens = tokenizeExpression('$uno.dos');
  expect(tokens).toEqual([
    { start: 0, end: 0, type: TokenKind.CtxPrefix, value: '$' },
    { start: 1, end: 3, type: TokenKind.Identifier, value: 'uno' },
    { start: 4, end: 4, type: TokenKind.Dot, value: '.' },
    { start: 5, end: 7, type: TokenKind.Identifier, value: 'dos' },
  ]);
});

test('tokenize: call function', () => {
  const tokens = tokenizeExpression('@uno(dos.a,  dos.b) }', '}');
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

test('tokenize: subexpression', () => {
  const tokens = tokenizeExpression('uno.2.[ dos.tres] }', '}');
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

test('tokenize: Single quoted', () => {
  const tokens = tokenizeExpression("uno.2.'first name'}", '}');
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
