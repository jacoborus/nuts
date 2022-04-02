import { Reader } from './reader';
import { IToken, TokenKind, Chars, Section } from './types';

export function tokenizeHtml(input: string): IToken[] {
  const reader = new Reader(input);
  while (reader.notFinished()) {
    switch (reader.section) {
      case Section.Literal:
        if (reader.scriptOn) {
          tokenizeScriptTail(reader);
          break;
        }
        tokenizeLiteral(reader);
        break;
      case Section.OpenTag:
        tokenizeTagName(reader);
        break;
      case Section.AfterOpenTag:
        tokenizeAfterOpenTag(reader);
        break;
      case Section.BeginAttribute:
        tokenizeBeginAttribute(reader);
        break;
      case Section.AttribName:
        tokenizeAttribName(reader);
        break;
      case Section.AfterAttribName:
        tokenizeAfterAttribName(reader);
        break;
      case Section.AttribValue:
        tokenizeAttribValue(reader);
        break;
      case Section.DQuoted:
        tokenizeDquoted(reader);
        break;
      case Section.SQuoted:
        tokenizeSquoted(reader);
        break;
      case Section.Comment:
        tokenizeComment(reader);
        break;
      case Section.Script:
        tokenizeScriptHead(reader);
        break;
    }
  }
  return reader.tokens;
}

function tokenizeLiteral(reader: Reader): void {
  if (reader.charCode() !== Chars.Lt) {
    reader.emitToken(TokenKind.Literal);
    return;
  }
  const nextChar = reader.nextCharCode();
  if (
    (nextChar >= Chars.La && nextChar <= Chars.Lz) ||
    (nextChar >= Chars.Ua && nextChar <= Chars.Uz)
  ) {
    // <d
    reader.emitToken(TokenKind.OpenTag);
    reader.section = Section.OpenTag;
  } else if (nextChar === Chars.Sl) {
    // </
    reader.emitToken(TokenKind.CloseTag, 2);
    tokenizeCloseTag(reader);
  } else if (nextChar === Chars.Lt) {
    // <<
    reader.emitToken(TokenKind.Literal);
  } else if (reader.isOpenComment()) {
    // <!--
    reader.emitToken(TokenKind.OpenComment, 4);
    reader.section = Section.Comment;
  } else {
    // <>
    // any other chars covert to normal state
    reader.emitToken(TokenKind.Literal);
  }
}

function tokenizeComment(reader: Reader): void {
  while (reader.notFinished() && !reader.isCommentEnd()) {
    reader.emitToken(TokenKind.Comment);
  }
  if (reader.isCommentEnd()) {
    reader.emitToken(TokenKind.CloseComment, 3);
    reader.section = Section.Literal;
  }
}

function tokenizeScriptHead(reader: Reader): void {
  reader.emitToken(TokenKind.OpenTag);
  reader.emitToken(TokenKind.TagName, 6);
  reader.scriptOn = true;
  reader.section = Section.AfterOpenTag;
}

function tokenizeScriptTail(reader: Reader): void {
  while (reader.notFinished() && !reader.isScriptEnd()) {
    reader.emitToken(TokenKind.Script);
  }
  if (reader.isScriptEnd()) {
    reader.emitToken(TokenKind.CloseTag, 2);
    reader.emitToken(TokenKind.TagName, 6);
    reader.emitToken(TokenKind.CloseTag);
    reader.section = Section.Literal;
    reader.scriptOn = false;
  }
}

function tokenizeTagName(reader: Reader): void {
  while (
    reader.notFinished() &&
    !reader.isWhiteSpace() &&
    !reader.isOpenTagEnd()
  ) {
    reader.emitToken(TokenKind.TagName);
  }
  reader.section = Section.AfterOpenTag;
}

export function tokenizeAfterOpenTag(reader: Reader): void {
  if (reader.isWhiteSpace()) {
    reader.emitToken(TokenKind.WhiteSpace);
    return;
  }
  if (reader.charCode() === Chars.Gt) {
    reader.emitToken(TokenKind.OpenTagEnd);
    reader.section = Section.Literal;
    return;
  }
  if (reader.isVoidTagEnd()) {
    reader.emitToken(TokenKind.VoidTagEnd, 2);
    reader.section = Section.Literal;
    return;
  }
  reader.section = Section.BeginAttribute;
}

function tokenizeBeginAttribute(reader: Reader): void {
  const charCode = reader.charCode();
  const nextCharCode = reader.nextCharCode();
  reader.hasExpression = false;
  if (charCode === Chars.C_) {
    reader.hasExpression = true;
    reader.emitToken(TokenKind.AttrPrefix);
    if (nextCharCode === Chars.C_) reader.emitToken(TokenKind.AttrPrefix);
  }
  reader.section = Section.AttribName;
}

function tokenizeAttribName(reader: Reader): void {
  while (
    reader.charCode() !== Chars.Eq &&
    reader.notFinished() &&
    !reader.isWhiteSpace() &&
    !reader.isOpenTagEnd()
  ) {
    reader.emitToken(TokenKind.AttrName);
  }
  reader.section = Section.AfterAttribName;
}

function tokenizeAfterAttribName(reader: Reader): void {
  if (reader.charCode() !== Chars.Eq) {
    reader.section = Section.AfterOpenTag;
    return;
  }
  reader.emitToken(TokenKind.AttrEq);
  reader.section = Section.AttribValue;
}

function tokenizeAttribValue(reader: Reader): void {
  if (reader.isWhiteSpace()) {
    reader.section = Section.AfterOpenTag;
    return;
  }
  const charCode = reader.charCode();
  if (reader.hasExpression) {
    if (charCode === Chars.Dq) {
      reader.emitToken(TokenKind.DQuote);
      reader.section = Section.AfterOpenTag;
      tokenizeExpression(reader, Chars.Dq);
      if (reader.notFinished()) {
        reader.emitToken(TokenKind.DQuote);
      }
    } else if (charCode === Chars.Sq) {
      reader.emitToken(TokenKind.SQuote);
      reader.section = Section.AfterOpenTag;
      tokenizeExpression(reader, Chars.Sq);
      if (reader.notFinished()) {
        reader.emitToken(TokenKind.SQuote);
      }
    } else {
      reader.section = Section.AfterOpenTag;
      tokenizeExpression(reader);
    }
    if (reader.notFinished()) {
      reader.section = Section.AfterOpenTag;
    }
  } else {
    if (charCode === Chars.Dq) {
      reader.emitToken(TokenKind.DQuote);
      reader.section = Section.DQuoted;
    } else if (charCode === Chars.Sq) {
      reader.emitToken(TokenKind.SQuote);
      reader.section = Section.SQuoted;
    } else {
      while (
        reader.notFinished() &&
        !reader.isWhiteSpace() &&
        !reader.isOpenTagEnd()
      ) {
        reader.emitToken(TokenKind.AttrValue);
      }
      if (reader.notFinished()) {
        reader.section = Section.AfterOpenTag;
      }
    }
  }
}

function tokenizeDquoted(reader: Reader): void {
  while (reader.notFinished() && reader.charCode() !== Chars.Dq) {
    reader.emitToken(TokenKind.AttrValue);
  }
  if (reader.charCode() === Chars.Dq) {
    reader.emitToken(TokenKind.DQuote);
    reader.section = Section.AfterOpenTag;
  }
}
function tokenizeSquoted(reader: Reader): void {
  while (reader.notFinished() && reader.charCode() !== Chars.Sq) {
    reader.emitToken(TokenKind.AttrValue);
  }
  if (reader.charCode() === Chars.Sq) {
    reader.emitToken(TokenKind.SQuote);
    reader.section = Section.AfterOpenTag;
  }
}

function tokenizeCloseTag(reader: Reader): void {
  if (reader.isWhiteSpace()) {
    reader.emitToken(TokenKind.WhiteSpace);
    reader.section = Section.Literal;
    return;
  }
  while (reader.notFinished() && reader.charCode() !== Chars.Gt) {
    reader.emitToken(TokenKind.TagName);
  }
  if (reader.notFinished()) {
    reader.emitToken(TokenKind.CloseTagEnd);
    reader.section = Section.Literal;
  }
}

function isCloser(reader: Reader, closer?: number): boolean {
  return closer ? reader.charCode() === closer : reader.isWhiteSpace();
}

export function tokenizeExpression(reader: Reader, closer?: number): void {
  const presection = reader.section;
  while (reader.notFinished() && !isCloser(reader, closer)) {
    switch (reader.section) {
      case Section.BeginExpression:
        tokenizeBeginExpression(reader);
        break;
      case Section.Identifier:
        tokenizeIdenfitier(reader);
        break;
      case Section.ExprQuoted:
        tokenizeQuoted(reader);
        break;
      default:
        reader.section = Section.BeginExpression;
    }
  }
  if (reader.notFinished()) reader.section = presection;
}

function tokenizeBeginExpression(reader: Reader): void {
  if (reader.isWhiteSpace()) {
    reader.emitToken(TokenKind.WhiteSpace);
    return;
  }
  if (reader.charCode() === Chars.At) {
    reader.emitToken(TokenKind.FuncPrefix);
    reader.section = Section.Identifier;
    return;
  }
  if (reader.charCode() === Chars.D$) {
    reader.emitToken(TokenKind.CtxPrefix);
    reader.section = Section.Identifier;
    return;
  }
  if (reader.isQuote()) {
    reader.section = Section.ExprQuoted;
    return;
  }
  reader.emitToken(TokenKind.Identifier);
  reader.section = Section.Identifier;
}

function tokenizeIdenfitier(reader: Reader): void {
  if (reader.charCode() === Chars.Do) {
    reader.emitToken(TokenKind.Dot);
    return;
  }
  if (reader.isWhiteSpace()) {
    reader.emitToken(TokenKind.WhiteSpace);
    reader.section = Section.BeginExpression;
    return;
  }
  if (reader.charCode() === Chars.Op) {
    reader.emitToken(TokenKind.OpenParens);
    reader.section = Section.BeginExpression;
    return;
  }
  if (reader.charCode() === Chars.Cp) {
    reader.emitToken(TokenKind.CloseParens);
    reader.section = Section.BeginExpression;
    return;
  }
  if (reader.charCode() === Chars.Ob) {
    reader.emitToken(TokenKind.OpenBracket);
    reader.section = Section.BeginExpression;
    return;
  }
  if (reader.charCode() === Chars.Cb) {
    reader.emitToken(TokenKind.CloseBracket);
    reader.section = Section.BeginExpression;
    return;
  }
  if (reader.charCode() === Chars.Co) {
    reader.emitToken(TokenKind.Comma);
    reader.section = Section.BeginExpression;
    return;
  }
  if (reader.isQuote()) {
    reader.section = Section.ExprQuoted;
    return;
  }
  reader.emitToken(TokenKind.Identifier);
}

export function tokenizeQuoted(reader: Reader): void {
  const quoteCode = reader.charCode();
  const kind = quoteCode === Chars.Sq ? TokenKind.SQuote : TokenKind.DQuote;
  reader.emitToken(kind);
  while (reader.notFinished() && reader.charCode() !== quoteCode) {
    reader.emitToken(TokenKind.Identifier);
  }
  if (reader.notFinished()) {
    reader.emitToken(kind);
  }
}

export function tokenizeNonLiteral(reader: Reader): void {
  const start = reader.index;
  const end = start;
  const value = reader.char();
  let kind: TokenKind;
  switch (reader.charCode()) {
    case Chars.At:
      kind = TokenKind.FuncPrefix;
      break;
    case Chars.D$:
      kind = TokenKind.CtxPrefix;
      break;
    case Chars.Do:
      kind = TokenKind.Dot;
      break;
    case Chars.Co:
      kind = TokenKind.Comma;
      break;
    case Chars.Ob:
      kind = TokenKind.OpenBracket;
      break;
    case Chars.Cb:
      kind = TokenKind.CloseBracket;
      break;
    case Chars.Op:
      kind = TokenKind.OpenParens;
      break;
    case Chars.Cp:
      kind = TokenKind.CloseParens;
      break;
    case Chars.Sq:
      kind = TokenKind.SQuote;
      break;
    case Chars.Dq:
      kind = TokenKind.DQuote;
      break;
    default:
      kind = TokenKind.DQuote;
      break;
  }
  reader.addToken({ start, end, value, type: kind });
  reader.next();
}

export function tokenizeLiteralExpression(reader: Reader): void {
  const start = reader.index;
  const value = reader.toNextNonLiteral();
  const end = reader.index - 1;
  reader.addToken({
    start,
    end,
    value,
    type: TokenKind.Identifier,
  });
}
