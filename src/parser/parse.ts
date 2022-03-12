import { AttSchema, ScriptSchema, CommentSchema, NodeTypes } from '../types';
import { booleanAttributes } from '../common';

class Reader {
  sourceFile: string;
  source: string;
  private index: number;
  constructor(sourceFile: string, source: string) {
    this.sourceFile = sourceFile;
    this.source = source;
    this.index = 0;
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

export function parseFile(sourceFile: string, source: string) {
  const reader = new Reader(sourceFile, source);
  const parent = [];
  while (reader.notFinished()) {
    reader.toNextWord();
    if (reader.isCommentTag()) {
      const comment = parseComment(reader);
      parent.push(comment);
      continue;
    }
    if (reader.isScriptTag()) {
      const script = parseScript(reader);
      parent.push(script);
      continue;
    }
  }
  return parent;
}

function parseComment(reader: Reader): CommentSchema {
  const start = reader.getIndex();
  const closerIndex = reader.indexOf('-->');
  const type = NodeTypes.COMMENT;
  const value = reader.slice(4, closerIndex);
  const end = start + closerIndex + 2;
  reader.setIndex(end + 1);
  return { type, value, start, end };
}

function parseScript(reader: Reader): ScriptSchema {
  const start = reader.getIndex();
  reader.advance('<script ');
  const attributes = parseAttribs(reader);
  const bodyEnd = reader.findNext(/<\/script/);
  const body = reader.slice(0, bodyEnd);
  reader.advance(bodyEnd + 8);
  reader.toNext(/>/);
  const end = reader.getIndex();

  return {
    type: NodeTypes.SCRIPT,
    value: body,
    attributes,
    start,
    end,
  };
}

export function parseAttribs(reader: Reader): AttSchema[] {
  const attribs: AttSchema[] = [];
  reader.toNextWord();

  while (!reader.isTagHeadEnd()) {
    attribs.push(parseAttribute(reader));
    if (reader.char() === '>') break;
    reader.toNextWord();
  }
  reader.next();
  return attribs;
}

export function parseAttribute(reader: Reader): AttSchema {
  const start = reader.getIndex();
  const rest = reader.slice();
  const separator = rest.match(/\s|=/);
  if (!separator || !separator.index) throw new Error('Wrong attribute name');
  const prename = rest.slice(0, separator.index);
  const { name, dynamic, reactive } = readAttribName(prename);
  const isBoolean = booleanAttributes.includes(name);
  reader.advance(prename + 1);
  let value = '';
  if (separator[0] === '=') {
    reader.toNext(/"|'/);
    const quote = reader.char();
    reader.next();
    const rest = reader.slice();
    const closerPos = rest.indexOf(quote);
    value = reader.slice(0, closerPos);
    reader.advance(value);
    reader.next();
  }
  const end = reader.getIndex();

  return {
    type: NodeTypes.ATTRIBUTE,
    name,
    value,
    isBoolean,
    dynamic,
    reactive,
    expr: [],
    start,
    end,
  };
}

function readAttribName(name: string) {
  if (name.startsWith('::')) {
    return {
      dynamic: true,
      reactive: true,
      name: name.slice(2),
    };
  } else if (name.startsWith(':')) {
    return {
      dynamic: true,
      reactive: false,
      name: name.slice(1),
    };
  } else {
    return {
      dynamic: false,
      reactive: false,
      name,
    };
  }
}
