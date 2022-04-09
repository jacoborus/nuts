import {
  ElemSchema,
  IAttr,
  ITag,
  IText,
  IToken,
  Section,
  TokenKind,
  NodeType,
  IAllAttribs,
} from '../src/types';

import { booleanAttributes, voidElements } from './common';

export class Reader {
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
}

export function parse(reader: Reader): ElemSchema[] {
  const schemas = [];
  while (reader.current() && reader.current().type !== TokenKind.CloseTag) {
    switch (reader.current().type) {
      case TokenKind.Literal:
        schemas.push(parseText(reader));
        break;
      case TokenKind.OpenTag:
        schemas.push(parseTag(reader));
        break;
      default:
        throw new Error('Unexpected token:' + reader.current().type);
    }
  }
  return schemas;
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
  const preAttribs = parseAttributes(reader);
  const attributes = preAttribs.filter(
    (att) => att.type === NodeType.Attr
  ) as IAttr[];
  if (reader.current().type === TokenKind.WhiteSpace) reader.next();
  if (!reader.hasTokens()) {
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
  reader.next();
  const body = parse(reader);
  return {
    type: NodeType.Tag,
    name: name, // lower case tag name, div
    rawName: tagName, // original case tag name, Div
    attributes,
    isVoid: false,
    events: [],
    isSubComp: false,
    body, // isVoid
    // original close tag, </DIV >
    close: undefined, // isVoid
    start: openTag.start,
    end: reader.current().end,
  };
}

export function parseAttributes(reader: Reader): IAllAttribs[] {
  const attributes: IAllAttribs[] = [];
  while (reader.hasTokens()) {
    const token = reader.current();
    const kind = token.type;
    if (kind === TokenKind.WhiteSpace) {
      reader.next();
      continue;
    }
    if (kind === TokenKind.AttrName) {
      const attrib = parseAttribute(reader);
      if (attrib) attributes.push(attrib);
      continue;
    }
    if (kind === TokenKind.OpenTagEnd || kind === TokenKind.VoidTagEnd) {
      break;
    }
    throw new Error('Unexpected token parsing attributes: ' + token.type);
  }
  return attributes;
}

function parseAttribute(reader: Reader): IAllAttribs | undefined {
  const name = reader.current();
  const isBoolean = booleanAttributes.includes(name.value);
  reader.next();
  if (isBoolean) {
    return {
      type: NodeType.Attr,
      name,
      isBoolean,
      start: name.start,
      end: name.end,
    };
  }
  if (reader.current().type !== TokenKind.AttrEq) {
    return {
      type: NodeType.Attr,
      name,
      isBoolean: false,
      start: name.start,
      end: name.end,
      err: 'incomplete attribute',
    };
  }
  reader.next();
  return parseAttrValue(reader, name);
}

function parseAttrValue(reader: Reader, name: IToken): IAttr {
  const opener = reader.current();
  if (opener.type === TokenKind.DQuote || opener.type === TokenKind.SQuote) {
    return parseQuotedAttrValue(reader, name);
  }
  return parseNoQuotedAttrValue(reader, name);
}

function parseQuotedAttrValue(reader: Reader, name: IToken): IAttr {
  reader.next();
  if (!reader.hasTokens() || reader.current().type !== TokenKind.AttrValue) {
    return {
      type: NodeType.Attr,
      name,
      isBoolean: false,
      start: name.start,
      end: name.end + 2,
      err: 'Attribute missing value: ' + name,
    };
  }
  const value = reader.current();
  reader.next();
  if (!reader.hasTokens()) {
    return {
      type: NodeType.Attr,
      name,
      value,
      isBoolean: false,
      start: name.start,
      end: value.end,
      err: 'Attribute not closed: ' + name,
    };
  }
  reader.next();
  return {
    type: NodeType.Attr,
    name,
    value,
    isBoolean: false,
    start: name.start,
    end: value.end + 1,
  };
}

function parseNoQuotedAttrValue(reader: Reader, name: IToken): IAttr {
  const value = reader.current();
  if (value.type !== TokenKind.AttrValue) {
    return {
      type: NodeType.Attr,
      name,
      isBoolean: false,
      start: name.start,
      end: name.end + 1,
      err: 'Attribute missing value: ' + name,
    };
  }
  return {
    type: NodeType.Attr,
    name,
    value,
    isBoolean: false,
    start: name.start,
    end: value.end,
  };
}
