import { IToken, Chars, TokenKind, Section } from './types';

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
  section: Section;
  lastToken?: IToken;
  hasExpression: boolean;
  scriptOn: boolean;
  constructor(source: string, opts?: ReaderOpts) {
    this.source = source;
    this.index = opts?.start || 0;
    if (opts?.closer) {
      this.closer = opts.closer;
    }
    this.tokens = [];
    this.section = Section.Literal;
    this.hasExpression = false;
    this.scriptOn = false;
  }
  next(amount = 1): void {
    this.index = this.index + amount;
  }
  char(pos?: number): string {
    return this.source[typeof pos === 'number' ? pos : this.index];
  }
  charCode(pos?: number): number {
    return this.source.charCodeAt(typeof pos === 'number' ? pos : this.index);
  }
  nextChar(): string {
    return this.source[this.index + 1];
  }
  nextCharCode(): number {
    return this.source.charCodeAt(this.index + 1);
  }
  slice(start = 0, end?: number): string {
    return end
      ? this.source.slice(this.index + start, this.index + start + end)
      : this.source.slice(this.index + start);
  }
  notFinished(): boolean {
    return this.index <= this.source.length;
  }
  isCloser(charCode: number): boolean {
    return this.closer ? this.charCode() === charCode : this.isWhiteSpace();
  }
  exprNotFinished(): boolean {
    return this.index < this.source.length && !this.isCloser(0);
  }
  isWhiteSpace(pos?: number): boolean {
    const charCode = this.charCode(pos);
    return whiteSpaces.includes(charCode);
  }
  isQuote(): boolean {
    return ["'", '"'].includes(this.char());
  }
  isTagName(keyword: string): boolean {
    const length = keyword.length;
    const word = this.slice(1, length);
    if (word.toLowerCase() !== keyword) return false;
    const nextPos = this.index + length;
    return this.isWhiteSpace(nextPos) || this.isClosingTag(nextPos);
  }
  isClosingTag(pos: number): boolean {
    const charCode = this.charCode(pos);
    if (charCode === Chars.Lt) return true;
    if (charCode !== Chars.Sl) return false;
    return this.charCode(pos + 1) === Chars.Lt;
  }
  isOpenComment(): boolean {
    return this.slice(0, 4) == '<!--';
  }
  isCommentEnd(): boolean {
    return this.slice(0, 3) == '-->';
  }
  isScriptEnd(): boolean {
    return this.slice(0, 9) == '</script>';
  }
  toNextNonWhiteInExpr(): string {
    const value = [];
    while (this.exprNotFinished() && this.isWhiteSpace()) {
      value.push(this.char());
      this.next();
    }
    return value.join('');
  }
  toNextNonLiteral(): string {
    const value = [];
    while (
      this.exprNotFinished() &&
      !this.isWhiteSpace() &&
      !this.isNonLiteral()
    ) {
      value.push(this.char());
      this.next();
    }
    return value.join('');
  }
  isNonLiteral(): boolean {
    return nonLiterals.includes(this.charCode());
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
  toNext(char: string): string {
    const value = [];
    while (this.notFinished() && this.char() !== char) {
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
  isOpenTagEnd(): boolean {
    if (this.charCode() === Chars.Gt) return true;
    if (this.charCode() !== Chars.Sl) return false;
    return this.nextCharCode() === Chars.Gt;
  }
  isVoidTagEnd(): boolean {
    if (this.charCode() !== Chars.Sl) return false;
    return this.nextCharCode() === Chars.Gt;
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
  addSingleToken(value: string, kind: TokenKind): void {
    const start = this.index;
    this.tokens.push({
      start,
      end: start,
      value,
      type: kind,
    });
  }
  emitToken(kind: TokenKind, times = 1): void {
    if (!this.lastToken) {
      this.lastToken = {
        start: this.index,
        end: this.index,
        type: kind,
        value: this.char(),
      };
    } else if (this.lastToken.type === kind) {
      this.lastToken.value += this.char();
      this.lastToken.end += 1;
    } else {
      this.addToken(this.lastToken);
      this.lastToken = {
        start: this.index,
        end: this.index,
        type: kind,
        value: this.char(),
      };
    }
    this.next();
    if (--times) this.emitToken(kind, times);
  }
}
