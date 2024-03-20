import { IToken, Section, TokenKind } from "./types.ts";
import { Chars } from "./common.ts";

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
    this.tokens = [];
    this.section = Section.Literal;
    this.hasExpression = false;
    this.scriptOn = false;
  }
  next(amount = 1): void {
    this.index = this.index + amount;
  }
  char(pos?: number): string {
    return this.source[typeof pos === "number" ? pos : this.index];
  }
  charCode(pos?: number): number {
    return this.source.charCodeAt(typeof pos === "number" ? pos : this.index);
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
    return this.index < this.source.length;
  }
  isCloser(charCode?: number): boolean {
    return charCode ? this.charCode() === charCode : this.isWhiteSpace();
  }
  isWhiteSpace(pos?: number): boolean {
    const charCode = this.charCode(pos);
    return whiteSpaces.includes(charCode);
  }
  isQuote(): boolean {
    return ["'", '"'].includes(this.char());
  }
  isOpenComment(): boolean {
    return this.slice(0, 4) == "<!--";
  }
  isCommentEnd(): boolean {
    return this.slice(0, 3) == "-->";
  }
  isScriptEnd(): boolean {
    return this.slice(0, 9) == "</script>";
  }
  toNext(char: string): string {
    const value = [];
    while (this.notFinished() && this.char() !== char) {
      value.push(this.char());
      this.next();
    }
    return value.join("");
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
  addToken(token: IToken): void {
    this.tokens.push(token);
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
      this.tokens.push(this.lastToken);
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
  getTokens(): IToken[] {
    return this.lastToken ? this.tokens.concat(this.lastToken) : this.tokens;
  }
}
