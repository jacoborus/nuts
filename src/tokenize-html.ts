import { HtmlReader as Reader } from './html-reader';
import { tokenizeExpression } from './tokenize-expression';
import { IToken, TokenKind, Chars } from './types';

export function tokenizeHtml(input: string): IToken[] {
  const reader = new Reader(input);
  while (reader.notFinished()) {
    const char = reader.char();
    if (char === '<') {
      if (reader.nextChar() === '/') tokenizeCloseTag(reader);
      else tokenizeOpenTag(reader);
      continue;
    }
    const start = reader.index;
    const value = reader.toNextTag();
    reader.addToken({
      start,
      end: reader.index - 1,
      value,
      type: TokenKind.Literal,
    });
  }
  return reader.tokens;
}

export function tokenizeOpenTag(reader: Reader): void {
  reader.addToken({
    start: reader.index,
    end: reader.index,
    value: '<',
    type: TokenKind.OpenTag,
  });
  reader.next();
  const start = reader.index;
  const value = reader.toWhiteOrClose();
  const end = reader.index - 1;
  const kind = TokenKind.TagName;
  reader.addToken({ start, end, value, type: kind });
  tokenizeAttributes(reader);
}

export function tokenizeAttributes(reader: Reader): void {
  while (reader.char() !== '>') {
    if (reader.isWhiteSpace()) {
      tokenizeWhiteSpace(reader);
      continue;
    }
    tokenizeAttribute(reader);
  }
  reader.addToken({
    start: reader.index,
    end: reader.index,
    value: '>',
    type: TokenKind.OpenTagEnd,
  });
  reader.next();
}

export function tokenizeAttribute(reader: Reader): void {
  const hasExpr = tokenizeAttPrefix(reader);
  const nameStart = reader.index;
  const attName = reader.getAttName();
  const nameEnd = reader.index - 1;
  reader.addToken({
    start: nameStart,
    end: nameEnd,
    value: attName,
    type: TokenKind.AttrName,
  });
  if (reader.char() !== '=') return;
  reader.addToken({
    start: reader.index,
    end: reader.index,
    value: '=',
    type: TokenKind.AttrEq,
  });
  reader.next();
  if (reader.isWhiteSpace()) return;
  const isQuoted = reader.isQuote();
  const quote = reader.char();
  const kind =
    reader.charCode() === Chars.Sq ? TokenKind.SQuote : TokenKind.DQuote;
  if (isQuoted) {
    reader.addToken({
      start: reader.index,
      end: reader.index,
      value: quote,
      type: kind,
    });
    reader.next();
  }
  if (hasExpr) {
    tokenizeExpression(reader.source, quote, reader.index);
  } else {
    const valueStart = reader.index;
    const value = isQuoted ? reader.toQuote(quote) : reader.toWhiteOrClose();
    reader.addToken({
      start: valueStart,
      end: reader.index - 1,
      value,
      type: TokenKind.AttrValue,
    });
  }
  if (reader.isQuote()) {
    reader.addToken({
      start: reader.index,
      end: reader.index,
      value: quote,
      type: kind,
    });
    reader.next();
  }
}

const attPrefixes = [':', '@'];
export function tokenizeAttPrefix(reader: Reader): boolean {
  const char = reader.char();
  if (!attPrefixes.includes(char)) return false;
  reader.addToken({
    start: reader.index,
    end: reader.index,
    value: char,
    type: TokenKind.AttrPrefix,
  });
  reader.next();
  return true;
}

export function tokenizeCloseTag(reader: Reader): void {
  reader.addToken({
    start: reader.index,
    end: reader.index + 1,
    value: '</',
    type: TokenKind.CloseTag,
  });
  reader.next();
  reader.next();
  const start = reader.index;
  const value = reader.toCloseTagEnd();
  const end = reader.index - 1;
  reader.addToken({
    start,
    end,
    value,
    type: TokenKind.TagName,
  });
  reader.addToken({
    start: reader.index,
    end: reader.index,
    value: '>',
    type: TokenKind.CloseTagEnd,
  });
  reader.next();
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
