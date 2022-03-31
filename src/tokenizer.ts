import { Reader } from './reader';
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
    const value = reader.toNext('<');
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
  while (
    reader.char() !== '>' &&
    !(reader.char() === '/' && reader.nextChar() === '>')
  ) {
    if (reader.isWhiteSpace()) {
      tokenizeWhiteSpace(reader);
      continue;
    }
    if (reader.char() === '(') {
      tokenizeDirective(reader);
      continue;
    }
    tokenizeAttribute(reader);
  }
  const isVoid = reader.char() === '/';
  const value = isVoid ? '/>' : '>';
  const end = reader.index + (isVoid ? 1 : 0);
  const kind = isVoid ? TokenKind.VoidTagEnd : TokenKind.OpenTagEnd;

  reader.addToken({
    start: reader.index,
    end,
    value,
    type: kind,
  });
  reader.next();
  isVoid && reader.next();
}

export function tokenizeDirective(reader: Reader): void {
  reader.addToken({
    start: reader.index,
    end: reader.index,
    value: '(',
    type: TokenKind.OpenParens,
  });
  reader.next();
  const dirStart = reader.index;
  const dirName = reader.toNext(')');
  reader.addToken({
    start: dirStart,
    end: reader.index - 1,
    value: dirName,
    type: TokenKind.AttrName,
  });
  if (reader.char() !== ')') return;
  reader.addToken({
    start: reader.index,
    end: reader.index,
    value: ')',
    type: TokenKind.CloseParens,
  });
  reader.next();
  if (reader.char() !== '=') return;
  reader.addToken({
    start: reader.index,
    end: reader.index,
    value: '=',
    type: TokenKind.AttrEq,
  });
  reader.next();
  tokenizeAttValue(reader, true);
}

function tokenizeAttValue(reader: Reader, dynamic: boolean): void {
  if (!reader.notFinished()) return;
  const isQuoted = reader.isQuote();
  const quote = isQuoted ? reader.char() : undefined;
  const kind =
    reader.charCode() === Chars.Sq ? TokenKind.SQuote : TokenKind.DQuote;
  if (isQuoted) {
    reader.addToken({
      start: reader.index,
      end: reader.index,
      value: quote as string,
      type: kind,
    });
    reader.next();
  }
  if (dynamic) tokenizeDynamicAttValue(reader, quote);
  else tokenizeRegularAttValue(reader, quote);
  if (reader.isQuote()) {
    reader.addToken({
      start: reader.index,
      end: reader.index,
      value: quote as string,
      type: kind,
    });
    reader.next();
  }
}

function tokenizeRegularAttValue(reader: Reader, quote?: string): void {
  const exprReader = new Reader(reader.source, {
    closer: quote,
    start: reader.index,
  });
  tokenizeExpression(exprReader);
  reader.index = exprReader.index;
  exprReader.tokens.forEach((token) => reader.addToken(token));
}

function tokenizeDynamicAttValue(reader: Reader, quote?: string): void {
  const exprReader = new Reader(reader.source, {
    closer: quote,
    start: reader.index,
  });
  tokenizeExpression(exprReader);
  reader.index = exprReader.index;
  exprReader.tokens.forEach((token) => reader.addToken(token));
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
    const exprReader = new Reader(reader.source, {
      closer: quote,
      start: reader.index,
    });
    tokenizeExpression(exprReader);
    reader.index = exprReader.index;
    exprReader.tokens.forEach((token) => reader.addToken(token));
  } else {
    const valueStart = reader.index;
    const value = isQuoted ? reader.toNext(quote) : reader.toWhiteOrClose();
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
  const value = reader.toNext('>');
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

export function tokenizeExpression(reader: Reader): IToken[] {
  while (reader.exprNotFinished()) {
    if (reader.isWhiteSpace()) {
      tokenizeWhiteSpaceInExpr(reader);
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
export function tokenizeWhiteSpaceInExpr(reader: Reader): void {
  const start = reader.index;
  const value = reader.toNextNonWhiteInExpr();
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
  const quote = reader.char();
  reader.addToken({
    start: reader.index,
    end: reader.index,
    value: quote,
    type: kind,
  });
  reader.next();
  const start = reader.index;
  const value = reader.toNext(quote);
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
