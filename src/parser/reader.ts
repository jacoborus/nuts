export class Reader {
  sourceFile: string;
  source: string;
  private index: number;
  constructor(sourceFile: string, source: string, index = 0) {
    this.sourceFile = sourceFile;
    this.source = source;
    this.index = index;
  }
  getIndex() {
    return this.index;
  }
  setIndex(index: number): void {
    this.index = index;
  }
  char(): string {
    return this.source[this.index];
  }
  slice(start = 0, end?: number): string {
    return end
      ? this.source.slice(this.index + start, this.index + end)
      : this.source.slice(this.index + start);
  }
  next(amount = 1): string {
    this.index += amount;
    return this.source[this.index];
  }
  getNext(): string {
    return this.source[this.index + 1];
  }
  toNextWord(): string {
    while (this.source[this.index] && this.source[this.index].match(/\s/))
      ++this.index;
    return this.source[this.index];
  }
  toNext(r: RegExp) {
    const rest = this.slice();
    const m = rest.match(r);
    if (!m || !('0' in m)) throw new Error('string not found');
    const result = this.slice(0, m.index);
    this.advance(m.index as number);
    return result;
  }
  findNext(r: RegExp): number {
    const str = this.slice();
    const res = str.match(r);
    // TODO: error here
    return res?.index as number;
  }
  notFinished(): boolean {
    return this.index < this.source.length - 2;
  }
  isCommentTag(): boolean {
    return this.slice(0, 4) === '<!--';
  }
  isScriptTag(): boolean {
    const str = this.slice(0, 8);
    return !!str.match(/<script\s/);
  }
  isTemplate(): boolean {
    const str = this.slice(0, 10);
    return !!str.match(/<template\s/);
  }
  isTagClosing(tagname = ''): boolean {
    const str = this.slice(0, 2 + tagname.length);
    return str === '</' + tagname;
  }
  isTagHeadEnd(): boolean {
    const rest = this.slice();
    return !!rest.match(/^\s*>/);
  }
  indexOf(text: string): number {
    const str = this.slice();
    return str.indexOf(text, this.index);
  }
  advance(amount: number | string) {
    const realAmount = typeof amount === 'number' ? amount : amount.length;
    this.index += realAmount;
  }
  isX(chars: string) {
    return this.slice(0, chars.length) === chars;
  }
}
