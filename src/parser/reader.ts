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
  getNext(): string {
    return this.source[this.index + 1];
  }
  next(): string {
    return this.source[++this.index];
  }
  toNextWord(): string {
    while (this.source[this.index] && this.source[this.index].match(/\s/))
      ++this.index;
    return this.source[this.index];
  }
  toNext(r: RegExp) {
    const first = this.index;
    while (!this.source[this.index].match(r)) ++this.index;
    return this.source.slice(first, this.index);
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
    return this.source.slice(this.index, this.index + 4) === '<!--';
  }
  isScriptTag(): boolean {
    const str = this.source.slice(this.index, this.index + 8);
    return !!str.match(/<script\s/);
  }
  isTagClosing(): boolean {
    const str = this.source.slice(this.index, this.index + 2);
    return str === '</';
  }
  isTagHeadEnd(): boolean {
    return this.source[this.index] === '>';
  }
  indexOf(text: string): number {
    const str = this.slice();
    return str.indexOf(text, this.index);
  }
  advance(amount: number | string) {
    const realAmount = typeof amount === 'number' ? amount : amount.length;
    this.index += realAmount;
  }
}
