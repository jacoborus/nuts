import { Section, Token, TokenKind } from "./types.ts";
import { Chars } from "./common.ts";

let buffer = "";
let index = 0;
const tokens: Token[] = [];
let section: Section = Section.Normal;
let char: number;
let sectionStart = 0;
let size = buffer.length;

function init(input: string) {
  buffer = input;
  index = 0;
  tokens.length = 0;
  char = buffer.charCodeAt(0);
  section = Section.Normal;
  sectionStart = 0;
  size = buffer.length;
}

function isWhiteSpace() {
  return char === Chars._S ||
    char === Chars._N ||
    char === Chars._T ||
    char === Chars._T ||
    char === Chars._R ||
    char === Chars._F;
}

function emitToken(kind: null | TokenKind, newSection?: Section) {
  if (kind) {
    tokens.push({
      type: kind,
      value: buffer.slice(sectionStart, index + 1),
      start: sectionStart,
      end: index,
    });
  }
  ++index;
  sectionStart = index;
  if (newSection === undefined) return;
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
  if (char === Chars.Oc) {
    emitToken(TokenKind.OpenCurly, Section.Expression);
    tokenizeInterpolation();
    return;
  }
  if (char === Chars.Lt) {
    section = Section.OpeningTag;
    return;
  }
  section = Section.Literal;
}

function tokenizeLiteral(): void {
  if (char === Chars.Lt) {
    index--;
    emitToken(TokenKind.Literal, Section.OpeningTag);
    return;
  }
  if (char === Chars.Oc) {
    index--;
    emitToken(TokenKind.Literal);
    emitToken(TokenKind.OpenCurly, Section.Interpolation);
    return;
  }
  ++index;
}

function tokenizeInterpolation(): void {
  emitToken(TokenKind.OpenCurly);
  while (char !== Chars.Cc) {
    ++index;
  }
  index--;
  emitToken(TokenKind.Expression);
  emitToken(TokenKind.CloseCurly, Section.Normal);
}

function tokenizeOpeningTag(): void {
  const nextChar = buffer.charCodeAt(index + 1);
  if (
    (nextChar >= Chars.La && nextChar <= Chars.Lz) ||
    (nextChar >= Chars.Ua && nextChar <= Chars.Uz)
  ) {
    // <d
    emitToken(TokenKind.OpenTag, Section.TagName);
  } else if (nextChar === Chars.Sl) {
    // </
    // TODO: check
    section = Section.ClosingTag;
    index += 2;
  } else if (
    nextChar === Chars.Ep &&
    buffer.charCodeAt(index + 2) === Chars.Cl &&
    buffer.charCodeAt(index + 3) === Chars.Cl
  ) {
    // <!--
    index += 3;
    emitToken(TokenKind.OpenComment, Section.Comment);
  } else {
    // any other chars convert to literal state
    section = Section.Literal;
    ++index;
  }
}

function tokenizeComment(): void {
  if (
    char !== Chars.Cl ||
    buffer.charCodeAt(index + 1) !== Chars.Cl ||
    buffer.charCodeAt(index + 2) !== Chars.Gt
  ) {
    ++index;
    return;
  }
  index--;
  emitToken(TokenKind.Comment);
  index += 2;
  emitToken(TokenKind.CloseComment, Section.Normal);
}

function tokenizeTagName(): void {
  if (isWhiteSpace()) {
    index--;
    emitToken(TokenKind.TagName, Section.WhiteSpace);
    return;
  }
  if (char === Chars.Gt) {
    index--;
    emitToken(TokenKind.TagName);
    emitToken(TokenKind.OpenTagEnd, Section.Normal);
    return;
  }
  ++index;
}

function tokenizeAfterOpenTag() {
  if (isWhiteSpace()) {
    section = Section.WhiteSpace;
    return;
  }
  if (char === Chars.Gt) {
    emitToken(TokenKind.OpenTagEnd, Section.Normal);
    return;
  }
  if (char === Chars.Sl && buffer.charCodeAt(index + 1) === Chars.Gt) {
    index++;
    emitToken(TokenKind.VoidTagEnd, Section.Normal);
    return;
  }
  section = Section.AttribName;
}

function tokenizeWhitespace(): void {
  if (isWhiteSpace()) {
    ++index;
    return;
  }
  index--;
  emitToken(TokenKind.WhiteSpace, Section.AfterOpenTag);
}

function tokenizeAttribName(): void {
  if (char === Chars.Eq) {
    index--;
    emitToken(TokenKind.AttrName);
    emitToken(TokenKind.AttrEq, Section.AfterAttribEqual);
    return;
  }
  if (isWhiteSpace()) {
    index--;
    emitToken(TokenKind.AttrName, Section.WhiteSpace);
    return;
  }
  if (char === Chars.Gt) {
    index--;
    emitToken(TokenKind.AttrName, Section.AfterOpenTag);
    return;
  }
  if (isWhiteSpace()) {
    index--;
    emitToken(TokenKind.AttrName, Section.WhiteSpace);
    return;
  }
  ++index;
}

function tokenizeAfterAttribEqual(): void {
  if (isWhiteSpace()) {
    section = Section.WhiteSpace;
    return;
  }
  if (char === Chars.Dq) {
    emitToken(TokenKind.DQuote, Section.DQuoted);
    return;
  }
  if (char === Chars.Sq) {
    emitToken(TokenKind.SQuote, Section.SQuoted);
    return;
  }
  section = Section.NQuoted;
}

function tokenizeAttribNQuoted(): void {
  if (char === Chars.Gt) {
    index--;
    emitToken(TokenKind.AttrValue);
    emitToken(TokenKind.OpenTagEnd, Section.Normal);
    return;
  }
  if (isWhiteSpace()) {
    index--;
    emitToken(TokenKind.AttrValue, Section.WhiteSpace);
    return;
  }
  ++index;
}

function tokenizeDquoted(): void {
  if (char === Chars.Dq) {
    index--;
    emitToken(TokenKind.AttrValue);
    emitToken(TokenKind.DQuote, Section.AfterOpenTag);
    return;
  }
  ++index;
}

function tokenizeSquoted(): void {
  if (char === Chars.Sq) {
    index--;
    emitToken(TokenKind.AttrValue);
    emitToken(TokenKind.SQuote, Section.AfterOpenTag);
    return;
  }
  ++index;
}

function tokenizeClosingTag(): void {
  if (char === Chars.Gt) {
    emitToken(TokenKind.CloseTag, Section.Normal);
    return;
  }
  ++index;
}
