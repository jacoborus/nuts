import { ExprReader as Reader } from './expression-reader';
import { IToken, TokenKind, Chars } from './types';

export function tokenizeExpression(
  input: string,
  closer?: string,
  start = 0
): IToken[] {
  const reader = new Reader(input, { start, closer });
  while (reader.notFinished()) {
    if (reader.isWhiteSpace()) {
      tokenizeWhiteSpace(reader);
      continue;
    }
    const char = reader.char();
    if (char === '"' || char === "'") {
      tokenizeQuoted(reader);
      continue;
    }
    if (reader.isNonLiteral()) {
      tokenizeNonLiteral(reader);
      continue;
    }
    tokenizeLiteral(reader);
  }
  return reader.tokens;
}

export function tokenizeWhiteSpace(reader: Reader): void {
  const start = reader.index;
  const value = reader.toNextNonWhite();
  const end = reader.index - 1;
  reader.addToken({
    start,
    end,
    value,
    type: TokenKind.WhiteSpace,
  });
}

export function tokenizeQuoted(reader: Reader): void {
  const quoteCode = reader.charCode();
  const kind = quoteCode === Chars.Sq ? TokenKind.SQuote : TokenKind.DQuote;
  reader.addToken({
    start: reader.index,
    end: reader.index,
    value: reader.char(),
    type: kind,
  });
  const start = reader.index + 1;
  const value = reader.getQuotedValue();
  reader.addToken({
    start,
    end: reader.index - 1,
    value,
    type: TokenKind.Identifier,
  });
  reader.addToken({
    start: reader.index,
    end: reader.index,
    value: reader.char(),
    type: kind,
  });
  reader.next();
}

export function tokenizeNonLiteral(reader: Reader): void {
  const start = reader.index;
  const end = start;
  const value = reader.char();
  let kind: TokenKind;
  switch (reader.charCode()) {
    case Chars.At:
      kind = TokenKind.FuncPrefix;
      break;
    case Chars.D$:
      kind = TokenKind.CtxPrefix;
      break;
    case Chars.Do:
      kind = TokenKind.Dot;
      break;
    case Chars.Co:
      kind = TokenKind.Comma;
      break;
    case Chars.Ob:
      kind = TokenKind.OpenBracket;
      break;
    case Chars.Cb:
      kind = TokenKind.CloseBracket;
      break;
    case Chars.Op:
      kind = TokenKind.OpenParens;
      break;
    case Chars.Cp:
      kind = TokenKind.CloseParens;
      break;
    case Chars.Sq:
      kind = TokenKind.SQuote;
      break;
    case Chars.Dq:
      kind = TokenKind.DQuote;
      break;
    default:
      kind = TokenKind.DQuote;
      break;
  }
  reader.addToken({ start, end, value, type: kind });
  reader.next();
}

export function tokenizeLiteral(reader: Reader): void {
  const start = reader.index;
  const value = reader.toNextNonLiteral();
  const end = reader.index - 1;
  reader.addToken({
    start,
    end,
    value,
    type: TokenKind.Identifier,
  });
}
