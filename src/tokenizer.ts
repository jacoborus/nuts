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

function isWhiteSpace() {
  return char === Chars._S ||
    char === Chars._N ||
    char === Chars._T ||
    char === Chars._T ||
    char === Chars._R ||
    char === Chars._F;
}

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
  console.log("NORMAL:");
  console.log({ char, letra: buffer[index], siguiente: buffer[index + 1] });
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
  index--;
}

function tokenizeLiteral(): void {
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
  emitToken(TokenKind.OpenCurly);
  while (char !== Chars.Cc) {
    ++index;
  }
  index--;
  emitToken(TokenKind.Expression);
  emitToken(TokenKind.CloseCurly, Section.Normal);
  index--;
}

function tokenizeOpeningTag(): void {
  console.log("OPENING:");
  console.log({ char, letra: buffer[index], siguiente: buffer[index + 1] });
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
    ++index;
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
    index--;
  }
}

function tokenizeAfterOpenTag() {
  if (isWhiteSpace()) {
    section = Section.WhiteSpace;
    index--;
    return;
  }
  if (char === Chars.Gt) {
    emitToken(TokenKind.OpenTagEnd, Section.Normal);
    index--;
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
  if (isWhiteSpace()) return;
  index--;
  emitToken(TokenKind.WhiteSpace, Section.AfterOpenTag);
}

function tokenizeAttribName(): void {
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
  if (char === Chars.Dq) {
    index--;
    emitToken(TokenKind.AttrValue);
    emitToken(TokenKind.DQuote, Section.AfterOpenTag);
    index--;
  }
}

function tokenizeSquoted(): void {
  if (char === Chars.Sq) {
    index--;
    emitToken(TokenKind.AttrValue);
    emitToken(TokenKind.SQuote, Section.AfterOpenTag);
    index--;
  }
}

function tokenizeClosingTag(): void {
  console.log("CLOSING:");
  console.log({ char, letra: buffer[index], siguiente: buffer[index + 1] });
  if (char === Chars.Gt) {
    emitToken(TokenKind.CloseTag, Section.Normal);
  }
}
