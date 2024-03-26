import { Section, Token, TokenKind } from "./types.ts";
import { Chars } from "./common.ts";

let buffer = "";
let index = 0;
const tokens: Token[] = [];
let section: Section = Section.Normal;
let char: number;
let sectionStart = 0;
let size = buffer.length;
let inScript = false;
let inStyle = false;

function init(input: string) {
  buffer = input;
  index = 0;
  tokens.length = 0;
  char = buffer.charCodeAt(0);
  section = Section.Normal;
  sectionStart = 0;
  size = buffer.length;
  inScript = false;
  inStyle = false;
}

function isWhiteSpace() {
  return char === Chars._S ||
    char === Chars._N ||
    char === Chars._T ||
    char === Chars._T ||
    char === Chars._R ||
    char === Chars._F;
}

function emitToken(kind: TokenKind) {
  tokens.push({
    type: kind,
    value: buffer.slice(sectionStart, index + 1),
    start: sectionStart,
    end: index,
  });
  ++index;
  sectionStart = index;
}

/** Template */
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
      case Section.Script:
        tokenizeScript();
        break;
      case Section.Style:
        tokenizeStyle();
        break;
    }
  }
  if (sectionStart < size) {
    switch (section) {
      case Section.Literal:
        --index;
        emitToken(TokenKind.Literal);
        break;
    }
  }
  return tokens;
}

function tokenizeNormal() {
  if (inScript) {
    section = Section.Script;
    return;
  }
  if (inStyle) {
    section = Section.Style;
    return;
  }
  if (char === Chars.Oc) {
    emitToken(TokenKind.OpenCurly);
    section = Section.Interpolation;
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
    --index;
    emitToken(TokenKind.Literal);
    section = Section.OpeningTag;
    return;
  }
  if (char === Chars.Oc) {
    --index;
    emitToken(TokenKind.Literal);
    emitToken(TokenKind.OpenCurly);
    section = Section.Interpolation;
    return;
  }
  ++index;
}

function tokenizeInterpolation(): void {
  if (char === Chars.Cc) {
    --index;
    section = Section.BeginExpression;
    tokenizeExpression();
    --index;
    emitToken(TokenKind.CloseCurly);
    section = Section.Normal;
    return;
  }
  ++index;
}

function tokenizeOpeningTag(): void {
  const nextChar = buffer.charCodeAt(index + 1);
  if (
    nextChar === 115 && // s
    buffer.charCodeAt(index + 2) === 99 && // c
    buffer.charCodeAt(index + 3) === 114 && // r
    buffer.charCodeAt(index + 4) === 105 && // i
    buffer.charCodeAt(index + 5) === 112 && // p
    buffer.charCodeAt(index + 6) === 116 // t
  ) {
    // <script
    emitToken(TokenKind.OpenTag);
    section = Section.TagName;
    inScript = true;
  } else if (
    nextChar === 115 && // s
    buffer.charCodeAt(index + 2) === 116 && // c
    buffer.charCodeAt(index + 3) === 121 && // r
    buffer.charCodeAt(index + 4) === 108 && // i
    buffer.charCodeAt(index + 5) === 101 // e
  ) {
    // <script
    emitToken(TokenKind.OpenTag);
    section = Section.TagName;
    inStyle = true;
  } else if (
    (nextChar >= Chars.La && nextChar <= Chars.Lz) ||
    (nextChar >= Chars.Ua && nextChar <= Chars.Uz)
  ) {
    // <d
    emitToken(TokenKind.OpenTag);
    section = Section.TagName;
  } else if (nextChar === Chars.Sl) {
    // </
    section = Section.ClosingTag;
    index += 2;
  } else if (
    nextChar === Chars.Ep &&
    buffer.charCodeAt(index + 2) === Chars.Cl &&
    buffer.charCodeAt(index + 3) === Chars.Cl
  ) {
    // <!--
    index += 3;
    emitToken(TokenKind.OpenComment);
    section = Section.Comment;
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
  --index;
  emitToken(TokenKind.Comment);
  index += 2;
  emitToken(TokenKind.CloseComment);
  section = Section.Normal;
}

function tokenizeTagName(): void {
  if (isWhiteSpace()) {
    --index;
    emitToken(TokenKind.TagName);
    section = Section.WhiteSpace;
    return;
  }
  if (char === Chars.Gt) {
    --index;
    emitToken(TokenKind.TagName);
    emitToken(TokenKind.OpenTagEnd);
    section = Section.Normal;
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
    emitToken(TokenKind.OpenTagEnd);
    section = Section.Normal;
    return;
  }
  if (char === Chars.Sl && buffer.charCodeAt(index + 1) === Chars.Gt) {
    index++;
    emitToken(TokenKind.VoidTagEnd);
    section = Section.Normal;
    return;
  }
  section = Section.AttribName;
}

function tokenizeWhitespace(): void {
  if (isWhiteSpace()) {
    ++index;
    return;
  }
  --index;
  emitToken(TokenKind.WhiteSpace);
  section = Section.AfterOpenTag;
}

function tokenizeAttribName(): void {
  if (char === Chars.Eq) {
    --index;
    emitToken(TokenKind.AttrName);
    emitToken(TokenKind.AttrEq);
    section = Section.AfterAttribEqual;
    return;
  }
  if (isWhiteSpace()) {
    --index;
    emitToken(TokenKind.AttrName);
    section = Section.WhiteSpace;
    return;
  }
  if (char === Chars.Gt) {
    --index;
    emitToken(TokenKind.AttrName);
    section = Section.AfterOpenTag;
    return;
  }
  if (isWhiteSpace()) {
    --index;
    emitToken(TokenKind.AttrName);
    section = Section.WhiteSpace;
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
    emitToken(TokenKind.DQuote);
    section = Section.DQuoted;
    return;
  }
  if (char === Chars.Sq) {
    emitToken(TokenKind.SQuote);
    section = Section.SQuoted;
    return;
  }
  section = Section.NQuoted;
}

function tokenizeAttribNQuoted(): void {
  if (char === Chars.Gt) {
    --index;
    emitToken(TokenKind.AttrValue);
    emitToken(TokenKind.OpenTagEnd);
    section = Section.Normal;
    return;
  }
  if (isWhiteSpace()) {
    --index;
    emitToken(TokenKind.AttrValue);
    section = Section.WhiteSpace;
    return;
  }
  ++index;
}

function tokenizeDquoted(): void {
  if (char === Chars.Dq) {
    --index;
    emitToken(TokenKind.AttrValue);
    emitToken(TokenKind.DQuote);
    section = Section.AfterOpenTag;
    return;
  }
  ++index;
}

function tokenizeSquoted(): void {
  if (char === Chars.Sq) {
    --index;
    emitToken(TokenKind.AttrValue);
    emitToken(TokenKind.SQuote);
    section = Section.AfterOpenTag;
    return;
  }
  ++index;
}

function tokenizeClosingTag(): void {
  if (char === Chars.Gt) {
    if (inScript) {
      emitToken(TokenKind.CloseTag);
      section = Section.Script;
    } else if (inStyle) {
      emitToken(TokenKind.CloseTag);
      section = Section.Style;
    } else {
      emitToken(TokenKind.CloseTag);
      section = Section.Normal;
    }
    return;
  }
  ++index;
}

function tokenizeScript(): void {
  if (
    char === Chars.Lt &&
    buffer.charCodeAt(index + 1) === Chars.Sl &&
    buffer.charCodeAt(index + 2) === 115 && // s
    buffer.charCodeAt(index + 3) === 99 && // c
    buffer.charCodeAt(index + 4) === 114 && // r
    buffer.charCodeAt(index + 5) === 105 && // i
    buffer.charCodeAt(index + 6) === 112 && // p
    buffer.charCodeAt(index + 7) === 116 // t
  ) {
    --index;
    emitToken(TokenKind.Literal);
    inScript = false;
    section = Section.ClosingTag;
    --index;
    return;
  }
  ++index;
}

function tokenizeStyle(): void {
  if (
    char === Chars.Lt &&
    buffer.charCodeAt(index + 1) === Chars.Sl &&
    buffer.charCodeAt(index + 2) === 115 && // s
    buffer.charCodeAt(index + 3) === 116 && // t
    buffer.charCodeAt(index + 4) === 121 && // y
    buffer.charCodeAt(index + 5) === 108 && // l
    buffer.charCodeAt(index + 6) === 101 // e
  ) {
    --index;
    emitToken(TokenKind.Literal);
    inStyle = false;
    section = Section.ClosingTag;
    --index;
    return;
  }
  ++index;
}

/* Expression */

function tokenizeExpression(): void {
  const end = index + 1;
  index = sectionStart;
  while (index <= end) {
    char = buffer.charCodeAt(index);
    switch (section) {
      case Section.BeginExpression:
        tokenizeBeginExpression();
        break;
      case Section.Identifier:
        tokenizeIdentifier();
        break;
      case Section.WhiteSpace:
        tokenizeInExprWhitespace();
        break;
    }
  }
}

function tokenizeBeginExpression(): void {
  if (isWhiteSpace()) {
    section = Section.WhiteSpace;
    return;
  }
  section = Section.Identifier;
}

function tokenizeIdentifier(): void {
  if (isWhiteSpace()) {
    --index;
    emitToken(TokenKind.Identifier);
    section = Section.WhiteSpace;
    return;
  }
  ++index;
}

function tokenizeInExprWhitespace(): void {
  if (!isWhiteSpace()) {
    --index;
    emitToken(TokenKind.WhiteSpace);
    section = Section.Identifier;
    return;
  }
  ++index;
}
