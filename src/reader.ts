import { IToken, Chars } from './types';

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
export class Reader {
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
