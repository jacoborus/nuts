import { Section, Token, TokenKind } from "./types.ts";
import { Chars } from "./common.ts";

let buffer = "";
let index = 0;
const tokens: Token[] = [];
let section: Section = Section.Normal;
let char: number;
let sectionStart = 0;
let preSection: Section.Literal | Section.Attribs | Section.OpenTag =
  Section.Literal;
let size = buffer.length;

function next() {
  if (index + 1 >= size) return false;
  index++;
  char = buffer.charCodeAt(index);
  return true;
}

function isWhiteSpace() {
  return char === Chars._S ||
    char === Chars._N ||
    char === Chars._T ||
    char === Chars._T ||
    char === Chars._R ||
    char === Chars._F;
}

const options = {
  normal: {
    "{": { emit: TokenKind.OpenCurly, section: Section.Expression },
    "<": { section: "openingTag" },
    default: { section: Section.Literal },
  },
  expression: {
    "}": ["emit closeCurly", "normal"],
    default: { plusIndex: 1 },
  },
  literal: {
    "{": {
      emit: [TokenKind.Literal, TokenKind.OpenCurly],
      section: Section.Expression,
    },
    "<": { section: Section.OpeningTag },
    default: { plusIndex: 1 },
  },
  openingTag: {
    tagname: ["emit openTag", "tagname"],
  },
  tagname: {
    whitespace: ["emit tagname", "attribs"],
    gt: ["emit openTagEnd", "normal"],
  },
  attribs: {
    attribname: ["emit whitespace", "attribname"],
  },
};

function emitToken(kind: TokenKind, newSection = section) {
  tokens.push({
    type: kind,
    value: buffer.slice(sectionStart, index + 1),
    start: sectionStart,
    end: index,
  });
  ++index;
  sectionStart = index;
  section = newSection;
}

export function tokenizeHtml(input: string): Token[] {
  init(input);
  while (index < size) {
    char = buffer.charCodeAt(index);
    switch (section) {
      case Section.Normal:
        tokenizeNormal();
        break;
      case Section.Literal:
        tokenizeLiteral();
        break;
      case Section.Interpolation:
        tokenizeInterpolation();
        break;
      case Section.OpeningTag:
        tokenizeOpeningTag();
        break;
      case Section.TagName:
        tokenizeTagName();
        break;
      case Section.AfterOpenTag:
        tokenizeAfterOpenTag();
        break;
      case Section.WhiteSpace:
        tokenizeWhitespace();
        break;
      case Section.AttribName:
        tokenizeAttribName();
        break;
      case Section.AfterAttribEqual:
        tokenizeAfterAttribEqual();
        break;
      case Section.NQuoted:
        tokenizeAttribNQuoted();
        break;
      case Section.DQuoted:
        tokenizeDquoted();
        break;
      case Section.SQuoted:
        tokenizeSquoted();
        break;
      case Section.ClosingTag:
        tokenizeClosingTag();
        break;
      case Section.Comment:
        tokenizeComment();
        break;
        // case Section.Script:
        //   tokenizeScriptHead();
        //   break;
    }
    index++;
  }
  if (sectionStart < size) {
    switch (section) {
      case Section.Literal:
        index--;
        emitToken(TokenKind.Literal);
        break;
    }
  }
  return tokens;
}

function tokenizeNormal() {
  console.log("tokenize normal", buffer[index]);
  if (char === Chars.Oc) {
    emitToken(TokenKind.OpenCurly, Section.Expression);
    tokenizeInterpolation();
    return;
  }
  if (char === Chars.Lt) {
    section = Section.OpeningTag;
    index--;
    return;
  }
  section = Section.Literal;
}

function tokenizeLiteral(): void {
  console.log("tokenize literal", buffer[index]);
  if (char === Chars.Lt) {
    index--;
    emitToken(TokenKind.Literal, Section.OpeningTag);
    index--;
    return;
  }
  if (char === Chars.Oc) {
    index--;
    emitToken(TokenKind.Literal, Section.Interpolation);
    emitToken(TokenKind.OpenCurly, Section.Interpolation);
    return;
  }
}

function tokenizeInterpolation(): void {
  console.log("tokenize interpolation", buffer[index]);
  emitToken(TokenKind.OpenCurly);
  while (char !== Chars.Cc) {
    ++index;
  }
  emitToken(TokenKind.Expression);
  ++index;
  emitToken(TokenKind.CloseCurly, preSection);
}

function tokenizeOpeningTag(): void {
  console.log("tokenize opening tag", buffer[index]);
  const nextChar = buffer.charCodeAt(index + 1);
  if (
    (nextChar >= Chars.La && nextChar <= Chars.Lz) ||
    (nextChar >= Chars.Ua && nextChar <= Chars.Uz)
  ) {
    // <d
    emitToken(TokenKind.OpenTag, Section.TagName);
    index--;
  } else if (nextChar === Chars.Sl) {
    // </
    section = Section.ClosingTag;
    next();
  } else if (
    nextChar === Chars.Ep &&
    buffer.charCodeAt(index + 2) === Chars.Cl &&
    buffer.charCodeAt(index + 3) === Chars.Cl
  ) {
    // <!--
    index += 3;
    emitToken(TokenKind.OpenComment, Section.Comment);
    index--;
  } else {
    // any other chars convert to normal state
    section = Section.Literal;
  }
}

function tokenizeComment(): void {
  console.log("tokenize comment", buffer[index]);
  while (
    index < size && buffer.charCodeAt(index) !== Chars.Cl &&
    buffer.charCodeAt(index + 1) !== Chars.Cl &&
    buffer.charCodeAt(index + 2) !== Chars.Gt
  ) {
    index++;
  }
  emitToken(TokenKind.Comment);
  index += 2;
  emitToken(TokenKind.CloseComment, Section.Normal);
  index--;
}

function tokenizeTagName(): void {
  console.log("tokenize tag name", buffer[index]);
  if (isWhiteSpace()) {
    index--;
    emitToken(TokenKind.TagName, Section.WhiteSpace);
    index--;
    return;
  }
  if (char === Chars.Gt) {
    index--;
    emitToken(TokenKind.TagName);
    emitToken(TokenKind.OpenTagEnd, Section.Normal);
  }
}

function tokenizeAfterOpenTag() {
  console.log("tokenize open tag", buffer[index]);
  if (isWhiteSpace()) {
    section = Section.WhiteSpace;
    index--;
    return;
  }
  if (char === Chars.Gt) {
    emitToken(TokenKind.OpenTagEnd, preSection);
    return;
  }
  if (char === Chars.Sl && buffer.charCodeAt(index + 1) === Chars.Gt) {
    index++;
    emitToken(TokenKind.VoidTagEnd, Section.Normal);
    return;
  }
  section = Section.AttribName;
  index--;
}

function tokenizeWhitespace(): void {
  console.log("tokenize whitespace", buffer[index]);
  if (isWhiteSpace()) return;
  index--;
  emitToken(TokenKind.WhiteSpace, Section.AfterOpenTag);
}

function tokenizeAttribName(): void {
  console.log("tokenize attrib name", buffer[index]);
  if (char === Chars.Eq) {
    index--;
    emitToken(TokenKind.AttrName);
    emitToken(TokenKind.AttrEq, Section.AfterAttribEqual);
    index--;
    return;
  }
  if (isWhiteSpace()) {
    index--;
    emitToken(TokenKind.AttrName, Section.WhiteSpace);
    tokenizeWhitespace();
    return;
  }
  if (char === Chars.Gt || isWhiteSpace()) {
    emitToken(TokenKind.AttrName, Section.AfterOpenTag);
    return;
  }
}

function tokenizeAfterAttribEqual(): void {
  console.log("tokenize after attrib equal", buffer[index]);
  if (isWhiteSpace()) {
    section = Section.WhiteSpace;
    index--;
    return;
  }
  if (char === Chars.Dq) {
    emitToken(TokenKind.DQuote, Section.DQuoted);
    index--;
    return;
  }
  if (char === Chars.Sq) {
    emitToken(TokenKind.SQuote, Section.SQuoted);
    index--;
    return;
  }
  section = Section.NQuoted;
  index--;
}

function tokenizeAttribNQuoted(): void {
  console.log("tokenize attrib value", buffer[index]);
  if (char === Chars.Gt) {
    index--;
    emitToken(TokenKind.AttrValue);
    emitToken(TokenKind.OpenTagEnd, Section.Normal);
    index--;
    return;
  }
  if (isWhiteSpace()) {
    index--;
    emitToken(TokenKind.AttrValue, Section.WhiteSpace);
    index--;
    return;
  }
}

function tokenizeDquoted(): void {
  console.log("tokenize double quoted", buffer[index]);
  if (char === Chars.Dq) {
    index--;
    emitToken(TokenKind.AttrValue);
    emitToken(TokenKind.DQuote, Section.AfterOpenTag);
    index--;
  }
}

function tokenizeSquoted(): void {
  console.log("tokenize single quoted", buffer[index]);
  if (char === Chars.Sq) {
    index--;
    emitToken(TokenKind.AttrValue);
    emitToken(TokenKind.SQuote, Section.AfterOpenTag);
    index--;
  }
}

function tokenizeClosingTag(): void {
  console.log("tokenize closing tag", buffer[index]);
  if (char === Chars.Gt) {
    emitToken(TokenKind.CloseTag, Section.Normal);
  }
}

function init(input: string) {
  buffer = input;
  index = 0;
  tokens.length = 0;
  char = buffer.charCodeAt(0);
  section = Section.Normal;
  sectionStart = 0;
  preSection = Section.Literal;
  size = buffer.length;
}
