import { IToken, Chars } from './types';

const whiteSpaces = [
  Chars._S,
  Chars._N,
  Chars._T,
  Chars._T,
  Chars._R,
  Chars._F,
];

interface HtmlReaderOpts {
  start?: number;
}
export class HtmlReader {
  readonly tokens: IToken[] = [];
  readonly source: string;
  index: number;
  constructor(source: string, opts?: HtmlReaderOpts) {
    this.source = source;
    this.index = opts?.start || 0;
    this.tokens = [];
  }
  next(): void {
    this.index++;
  }
  char(): string {
    return this.source[this.index];
  }
  nextChar(): string {
    return this.source[this.index + 1];
  }
  charCode(): number {
    return this.source.charCodeAt(this.index);
  }
  notFinished(): boolean {
    return this.index < this.source.length;
  }
  isWhiteSpace(): boolean {
    return whiteSpaces.includes(this.charCode());
  }
  isQuote(): boolean {
    return ["'", '"'].includes(this.char());
  }
  getAttName(): string {
    const value = [];
    while (
      this.notFinished() &&
      !this.isWhiteSpace() &&
      this.char() !== '>' &&
      this.char() !== '='
    ) {
      value.push(this.char());
      this.next();
    }
    return value.join('');
  }
  getAttValue(): string {
    const value = [];
    while (
      this.notFinished() &&
      !this.isWhiteSpace() &&
      this.char() !== '>' &&
      this.char() !== '='
    ) {
      value.push(this.char());
      this.next();
    }
    return value.join('');
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
  toQuote(quote: string): string {
    const value = [];
    while (this.notFinished() && this.char() !== quote) {
      value.push(this.char());
      this.next();
    }
    return value.join('');
  }
  toCloseTagEnd(): string {
    const value = [];
    while (this.notFinished() && this.char() !== '>') {
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
  toNextTag(): string {
    const value = [];
    while (this.notFinished() && this.char() !== '<') {
      value.push(this.char());
      this.next();
    }
    return value.join('');
  }
  toWhiteOrClose(): string {
    const value = [];
    while (this.notFinished() && !this.isWhiteSpace() && this.char() !== '>') {
      value.push(this.char());
      this.next();
    }
    return value.join('');
  }
  addToken(token: IToken): void {
    this.tokens.push(token);
  }
}
