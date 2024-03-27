import { Section, Token, TokenKind } from "./types.ts";
import { Chars } from "./common.ts";

let buffer = "";
let index = 0;
const tokens: Token[] = [];
let section: Section = Section.Normal;
let char: number;
let sectionStart = 0;
let size = buffer.length;
let offset = 0;

function init(input: string, start: number) {
  buffer = input;
  index = 0;
  tokens.length = 0;
  char = buffer.charCodeAt(0);
  section = Section.Normal;
  sectionStart = 0;
  size = buffer.length;
  offset = start;
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
    start: sectionStart + offset,
    end: index + offset,
  });
  ++index;
  sectionStart = index;
}

/**
 * @param token -
 * @returns tokenized expression in token.value
 */
export function lexer(token: Token): Token[] {
  init(token.value, token.start);
  while (index < size) {
    char = buffer.charCodeAt(index);
    switch (section) {
      case Section.Normal:
        tokenizeNormal();
        break;
      case Section.WhiteSpace:
        tokenizeWhitespace();
        break;
      case Section.DQuoted:
        tokenizeDQuoted();
        break;
      case Section.SQuoted:
        tokenizeSQuoted();
        break;
      case Section.Identifier:
        tokenizeIdentifier();
        break;
    }
  }
  if (section === Section.Identifier) {
    --index;
    emitToken(TokenKind.Identifier);
  }
  if (section === Section.WhiteSpace) {
    --index;
    emitToken(TokenKind.WhiteSpace);
  }
  return tokens;
}

function tokenizeNormal(): void {
  if (isWhiteSpace()) {
    section = Section.WhiteSpace;
    return;
  }
  if (
    (char >= Chars.La && char <= Chars.Lz) ||
    (char >= Chars.Ua && char <= Chars.Uz) ||
    char === Chars.D$ || char === Chars.U_
  ) {
    section = Section.Identifier;
    return;
  }
  if (char === Chars.Dq) {
    section = Section.DQuoted;
    emitToken(TokenKind.DQuote);
    return;
  }
  if (char === Chars.Sq) {
    section = Section.SQuoted;
    emitToken(TokenKind.SQuote);
    return;
  }
  if (char === Chars.Dq) {
    section = Section.DQuoted;
    emitToken(TokenKind.SQuote);
    return;
  }
}

function tokenizeDQuoted(): void {
  if (char === Chars.Dq) {
    --index;
    emitToken(TokenKind.Literal);
    emitToken(TokenKind.DQuote);
    section = Section.AfterOpenTag;
    return;
  }
  ++index;
}

function tokenizeSQuoted(): void {
  if (char === Chars.Sq) {
    --index;
    emitToken(TokenKind.Literal);
    emitToken(TokenKind.SQuote);
    section = Section.AfterOpenTag;
    return;
  }
  ++index;
}

function tokenizeWhitespace(): void {
  if (!isWhiteSpace()) {
    --index;
    emitToken(TokenKind.WhiteSpace);
    section = Section.Normal;
    return;
  }
  ++index;
}

function tokenizeIdentifier() {
  if (
    (char >= Chars.La && char <= Chars.Lz) ||
    (char >= Chars.Ua && char <= Chars.Uz) ||
    (char >= Chars.N0 && char <= Chars.N9) ||
    char === Chars.D$ || char === Chars.U_
  ) {
    ++index;
    return;
  }
  console.log({ index, char, letra: buffer[index] });
  --index;
  emitToken(TokenKind.Identifier);
  section = Section.Normal;
}
