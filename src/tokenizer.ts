export interface IToken {
  type: TokenKind;
  value: string;
  start: number;
  end: number;
}

export enum TokenKind {
  Identifier,
  CtxPrefix, // $
  FuncPrefix, // @
  WhiteSpace,
  Dot, // .
  Comma, // ,
  OpenBracket, // [
  CloseBracket, // ]
  OpenParens, // (
  CloseParens, // )
  SQuote, // '
  DQuote, // "
}

export const enum Chars {
  _S = 32, // ' '
  _N = 10, // \n
  _T = 9, // \t
  _R = 13, // \r
  _F = 12, // \f
  Sq = 39, // '
  Dq = 34, // "
  Do = 46, // .
  Co = 44, // ,
  At = 64, // @
  D$ = 36, // $
  Op = 40, // ( open parens
  Cp = 41, // ) close it
  Ob = 91, // [ open bracket
  Cb = 93, // ] close it
  Ox = 123, // { open curly brace
  Cx = 125, // } close it
  Sl = 47, // /
}

const nonLiterals = [
  Chars.Sq,
  Chars.Dq,
  Chars.Do,
  Chars.Co,
  Chars.At,
  Chars.D$,
  Chars.Op,
  Chars.Cp,
  Chars.Ob,
  Chars.Cb,
];

const whiteSpaces = [
  Chars._S,
  Chars._N,
  Chars._T,
  Chars._T,
  Chars._R,
  Chars._F,
];

interface ReaderOpts {
  start?: number;
  closer?: string;
}
class Reader {
  readonly tokens: IToken[] = [];
  source: string;
  index: number;
  closer?: string;
  constructor(source: string, opts?: ReaderOpts) {
    this.source = source;
    this.index = opts?.start || 0;
    if (opts?.closer) {
      this.closer = opts.closer;
    }
    this.tokens = [];
  }
  next(): void {
    this.index++;
  }
  char(): string {
    return this.source[this.index];
  }
  charCode(): number {
    return this.source.charCodeAt(this.index);
  }
  isCloser(): boolean {
    return this.closer ? this.char() === this.closer : this.isWhiteSpace();
  }
  notFinished(): boolean {
    return this.index < this.source.length && !this.isCloser();
  }
  isWhiteSpace(): boolean {
    return whiteSpaces.includes(this.charCode());
  }
  getQuotedValue(): string {
    const quote = this.char();
    if (!['"', "'"].includes(quote)) throw new Error('Wrong quoted index');
    this.next();
    const value = [];
    while (this.index < this.source.length && this.char() !== quote) {
      value.push(this.char());
      this.next();
    }
    return value.join('');
  }
  toNextNonWhite(): string {
    const value = [];
    while (this.notFinished() && this.isWhiteSpace()) {
      value.push(this.char());
      this.next();
    }
    return value.join('');
  }
  toNextNonLiteral(): string {
    const value = [];
    while (this.notFinished() && !this.isWhiteSpace() && !this.isNonLiteral()) {
      value.push(this.char());
      this.next();
    }
    return value.join('');
  }
  isNonLiteral(): boolean {
    return nonLiterals.includes(this.charCode());
  }
  addToken(token: IToken): void {
    this.tokens.push(token);
  }
}

export function tokenize(input: string, closer?: string): IToken[] {
  const reader = new Reader(input, { closer });
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
