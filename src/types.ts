import { SourceFile } from 'typescript';

export const enum Section {
  Literal,
  OpenTag,
  Script,
  Style,
  Doctype,
  TagName,
  Attribs,
  BeginAttribute,
  ClosingTag,
  Expression,
  Comment,
  AfterOpenTag,
  AttribName,
  AfterAttribName,
  AttribValue,
  DQuoted,
  SQuoted,
  AttribExpression,
  BeginExpression,
  Identifier,
  ExprMethod,
}

export interface IToken {
  type: TokenKind;
  value: string;
  start: number;
  end: number;
}

export enum TokenKind {
  Beginning,
  WhiteSpace,
  // html
  Literal,
  OpenTag, // '<'
  TagName, // '<' or '</'
  OpenTagEnd, // '>',
  VoidTagEnd, // '/>'
  CloseTag, // leading '</'
  CloseTagEnd, // tailing '>'
  Comment,
  Script,
  AttrPrefix, // '@', ':' or '::'
  AttrName,
  AttrEq,
  AttrQuote,
  AttrValue,
  Directive,
  OpenComment,
  CloseComment,
  // Expression
  Identifier,
  CtxPrefix, // $
  FuncPrefix, // @
  Dot, // .
  Comma, // ,
  OpenBracket, // [
  CloseBracket, // ]
  OpenParens, // (
  CloseParens, // )
  SQuote, // '
  DQuote, // "
  Unexpected,
}

export const enum Chars {
  _S = 32, // ' '
  _N = 10, // \n
  _T = 9, // \t
  _R = 13, // \r
  _F = 12, // \f
  Sq = 39, // '
  Dq = 34, // "
  Lt = 60, // <
  Ep = 33, // !
  Cl = 45, // -
  La = 97, // a
  Lz = 122, // z
  Ua = 65, // A
  Uz = 90, // Z
  Gt = 62, // >
  Do = 46, // .
  Co = 44, // ,
  C_ = 58, // :
  Sc = 59, // ;
  Eq = 61, // =
  At = 64, // @
  D$ = 36, // $
  Op = 40, // ( open parens
  Cp = 41, // ) close it
  Ob = 91, // [ open bracket
  Cb = 93, // ] close it
  Ox = 123, // { open curly brace
  Cx = 125, // } close it
  Sl = 47, // /
}

export const enum NodeTypes {
  COMMENT,
  TEXT,
  TAG,
  ATTRIBUTE,
  EVENT,
  LOOP,
  TREE,
  SUBCOMPONENT,
  COMPONENT,
  SCRIPT,
  TEMPLATE,
}

export const directiveTags = ['if', 'else', 'elseif', 'loop'];
export const directiveNames = [
  'if',
  'else',
  'elseif',
  'loop',
  'ref',
  'index',
  'pos',
];
export type DirectiveName =
  | 'if'
  | 'else'
  | 'elseif'
  | 'ref'
  | 'loop'
  | 'index'
  | 'pos';

interface Item {
  start: number;
  end: number;
}

export interface Expression extends Item {
  // 0 = context
  // 1 = current scope
  // 2 = parent scope
  // 3 = parent of parent scope
  // ...
  scope: number;
  slabs: (Slab | Expression | ExprMethod)[];
}
export interface Slab extends Item {
  value: string;
}
export interface ExprMethod extends Item {
  method: Expression[];
  params: Expression[];
}

export type ElemSchema =
  | SubCompSchema
  | LoopSchema
  | TreeSchema
  | CommentSchema
  | TextSchema
  | TagSchema;

export interface CommentSchema extends Item {
  type: NodeTypes.COMMENT;
  value: string;
}

export interface TextSchema extends Item {
  type: NodeTypes.TEXT;
  value: string;
  dynamic: boolean;
  reactive: boolean;
  expr?: Expression;
}

export interface TagSchema extends Item {
  type: NodeTypes.TAG;
  name: string;
  isVoid: boolean;
  ref?: string;
  attributes: AttSchema[];
  events: EventSchema[];
  children: ElemSchema[];
  isDirective?: boolean;
}

export interface AttName extends Item {
  value: string;
  expr?: Expression;
}

export interface AttValue extends Item {
  value: string;
  expr?: Expression;
}

export interface AttSchema extends Item {
  type: NodeTypes.ATTRIBUTE;
  name: AttName;
  value?: AttValue;
  isBoolean: boolean;
  isEvent: boolean;
  dynamic: boolean;
  reactive: boolean;
  expr?: Expression;
  isDirective?: boolean;
}

export interface EventSchema extends Item {
  type: NodeTypes.EVENT;
  name: string;
  value: string;
}

export type Attributes = AttSchema | EventSchema;

export interface LoopSchema extends Item {
  type: NodeTypes.LOOP;
  target: Expression;
  index?: string;
  pos?: string; // index + 1
  source?: AttSchema;
  children: ElemSchema[];
}

export type TreeKind = 'if' | 'elseif' | 'else';
export interface TreeSchema extends Item {
  type: NodeTypes.TREE;
  kind: TreeKind;
  requirement: Expression;
  yes: ElemSchema[];
  no: ElemSchema[];
  reactive: boolean;
}

export interface SubCompSchema extends Item {
  type: NodeTypes.SUBCOMPONENT;
  name: string;
  ref?: string;
  events: EventSchema[];
  attributes: AttSchema[];
  children: ElemSchema[];
}

export interface ScriptSchema extends Item {
  type: NodeTypes.SCRIPT;
  attributes: AttSchema[];
  value: string;
}

export interface CodeSchema extends Item {
  type: NodeTypes.SCRIPT;
  attributes: AttSchema[];
  value: string;
  ast: SourceFile;
}

export interface TemplateSchema extends Item {
  type: NodeTypes.TEMPLATE;
  attributes: AttSchema[];
  schema: ElemSchema[];
}

export interface ComponentSchema {
  type: NodeTypes.COMPONENT;
  sourceFile: string;
  source: string;
  template?: TemplateSchema;
  scripts: ScriptSchema[];
  comments: CommentSchema[];
  children: ElemSchema[];
}
