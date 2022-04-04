import {
  ElemSchema,
  IAttr,
  ITag,
  IText,
  IToken,
  Section,
  TokenKind,
  NodeType,
} from '../src/types';

import { voidElements } from './common';

class Reader {
  index: number;
  tokens: IToken[];
  section: Section;
  schemas: ElemSchema[];
  constructor(tokens: IToken[]) {
    this.index = 0;
    this.tokens = tokens;
    this.section = Section.Literal;
    this.schemas = [];
  }
  hasTokens(): boolean {
    return this.index < this.tokens.length;
  }
  next(): void {
    this.index += 1;
  }
  current(): IToken {
    return this.tokens[this.index];
  }
  push(node: ElemSchema): void {
    this.schemas.push(node);
  }
}

export function parse(tokens: IToken[]): ElemSchema[] {
  const reader = new Reader(tokens);
  while (reader.current()) {
    switch (reader.current().type) {
      case TokenKind.Literal:
        reader.push(parseText(reader));
        break;
      case TokenKind.OpenTag:
        reader.push(parseTag(reader));
        break;
      default:
        throw new Error('Unexpected token:' + reader.current().type);
    }
  }
  return reader.schemas;
}

function parseText(reader: Reader): IText {
  const token = reader.current();
  reader.next();
  return Object.assign({}, token, { type: NodeType.Text });
}

function parseTag(reader: Reader): ITag {
  const openTag = reader.current();
  reader.next();
  const tagName = reader.current();
  const name = tagName.value.toLowerCase();
  const isVoid = voidElements.includes(name);
  reader.next();
  const [attributes, fail] = parseAttributes(reader);
  if (reader.current().type === TokenKind.WhiteSpace) reader.next();
  if (fail || !reader.hasTokens()) {
    return {
      type: NodeType.Tag,
      name: name, // lower case tag name, div
      rawName: tagName, // original case tag name, Div
      attributes,
      isVoid,
      events: [],
      isSubComp: false,
      body: undefined,
      close: undefined, // EOF before open tag end
      start: openTag.start,
      end: reader.index - 1,
    };
  }
  if (isVoid) {
    const end = reader.current().end;
    reader.next();
    return {
      type: NodeType.Tag,
      name: name, // lower case tag name, div
      rawName: tagName, // original case tag name, Div
      attributes,
      isVoid: true,
      events: [],
      isSubComp: false,
      body: null, // isVoid
      // original close tag, </DIV >
      close: null, // isVoid
      start: openTag.start,
      end,
    };
  }
  return {
    type: NodeType.Tag,
    name: name, // lower case tag name, div
    rawName: tagName, // original case tag name, Div
    attributes,
    isVoid: true,
    events: [],
    isSubComp: false,
    body: undefined, // isVoid
    // original close tag, </DIV >
    close: undefined, // isVoid
    start: openTag.start,
    end: reader.index - 1,
  };
}

function parseAttributes(reader: Reader): [IAttr[], boolean?] {
  if (reader.current().type === TokenKind.WhiteSpace) reader.next();
  return [[]];
}
