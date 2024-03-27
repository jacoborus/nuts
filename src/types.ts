import { SourceFile } from "npm:typescript";

export const enum Section {
  WhiteSpace = "WhiteSpace",
  Normal = "Normal",
  Literal = "Literal",
  Interpolation = "Interpolation",
  AfterInterpolation = "AfterInterpolation",
  OpeningTag = "OpeningTag",
  OpenTag = "OpenTag",
  Script = "Script",
  Style = "Style",
  Doctype = "Doctype",
  TagName = "TagName",
  Attribs = "Attribs",
  ClosingTag = "ClosingTag",
  Expression = "Expression",
  Comment = "Comment",
  AfterOpenTag = "AfterOpenTag",
  AttribName = "AttribName",
  DirectiveName = "DirectiveName",
  AfterAttribEqual = "AfterAttribEqual",
  NQuoted = "NQuoted",
  DQuoted = "DQuoted",
  SQuoted = "SQuoted",
  AttribExpression = "AttribExpression",
  BeginExpression = "BeginExpression",
  Identifier = "Identifier",
  ExprMethod = "ExprMethod",
  ExprQuoted = "ExprQuoted",
  AfterExpression = "AfterExpression",
  AfterIdentifier = "AfterIdentifier",
}

interface Base {
  start: number;
  end: number;
}

export interface Token extends Base {
  type: TokenKind;
  value: string;
}

export enum TokenKind {
  WhiteSpace = "WhiteSpace",
  // html
  Literal = "Literal",
  OpenTag = "OpenTag", // leading '<'
  OpenTagEnd = "OpenTagEnd", // tailing '>',
  Interpolation = "Interpolation",
  TagName = "TagName",
  VoidTagEnd = "VoidTagEnd", // tailing '/>'
  CloseTag = "CloseTag", // leading '</'
  CloseTagEnd = "CloseTagEnd", // tailing '>'
  Comment = "Comment",
  OpenComment = "OpenComment",
  CloseComment = "CloseComment",
  Script = "Script",
  AttrPrefix = "AttrPrefix", // '@', ':' or '::'
  AttrName = "AttrName",
  AttrEq = "AttrEq",
  AttrQuote = "AttrQuote",
  AttrValue = "AttrValue",
  OpenCurly = "OpenCurly", // {
  CloseCurly = "CloseCurly", // }
  Expression = "Expression",
  // Expression
  Identifier = "Identifier",
  Dot = "Dot", // .
  Comma = "Comma", // ,
  OpenBracket = "OpenBracket", // [
  CloseBracket = "CloseBracket", // ]
  OpenParens = "OpenParens", // (
  CloseParens = "CloseParens", // )
  SQuote = "SQuote", // '
  DQuote = "DQuote", // "
  Unexpected = "Unexpected",
}

export const enum NodeType {
  Attr,
  Comment,
  Event,
  Interpolated,
  Loop,
  Prop, // Dynamic attribute
  Script,
  Tag,
  Template,
  Text,
  Tree,
}

export const directiveTags = ["if", "else", "elseif", "loop", "slot", "place"];

export const directiveNames = [
  "if",
  "else",
  "elseif",
  "loop",
  "ref",
  "key",
  "slot",
  "place",
];

export interface Text extends Base {
  type: NodeType.Text;
  value: string;
}

export interface Interpolated extends Base {
  type: NodeType.Interpolated;
  expr: Expression;
  reactive: boolean;
}

export type IAllAttribs = IAttr | IAttrDyn | IEvent;

export interface IAttr extends Base {
  type: NodeType.Attr;
  name: Token;
  value?: Token;
  isBoolean: boolean;
  err?: string;
}

export interface IAttrDyn extends Base {
  type: NodeType.Interpolated;
  name: Token;
  expr: Expression;
  isBoolean: boolean;
  isReactive: boolean;
  err?: string;
}

export interface IEvent extends Base {
  type: NodeType.Event;
  name: string;
  expr: Expression;
}

export interface ITag extends Base {
  type: NodeType.Tag;
  name: string; // lower case tag name, div
  rawName: Token; // original case tag name, Div
  attributes: (IAttr | IAttrDyn)[];
  events: IEvent[];
  ref?: string;
  isVoid: boolean;
  isSubComp: boolean;
  body:
    | ElemSchema[] // with close tag
    | undefined // isVoid
    | null; // EOF before open tag end
  // original close tag, </DIV >
  close:
    | Text // with close tag
    | undefined // isVoid
    | null; // EOF before end or without close tag
}

export interface IComment extends Base {
  type: NodeType.Comment;
  value: string;
}

export type DirectiveName =
  | "if"
  | "else"
  | "elseif"
  | "ref"
  | "loop"
  | "index"
  | "pos";

export interface LoopSchema extends Base {
  type: NodeType.Loop;
  loop: Expression;
  target: Token;
  index?: Token;
  pos?: Token; // index + 1
  body: ElemSchema[];
}

export type TreeKind = "if" | "elseif" | "else";
export interface TreeSchema extends Base {
  type: NodeType.Tree;
  kind: TreeKind;
  condition: Expression;
  yes: ElemSchema[];
  no: ElemSchema[];
  reactive: boolean;
}

export interface ITemplate extends ITag {
  name: "template";
}

export interface IScript extends Omit<ITag, "type" | "body"> {
  type: NodeType.Script;
  body: Text;
}

export interface CodeSchema extends Omit<ITag, "type"> {
  type: NodeType.Script;
  ast: SourceFile;
}

export interface ComponentSchema {
  sourceFile: string;
  source: string;
  template: ITemplate;
  script: IScript;
  children: ElemSchema[];
}

export const enum ExprScope {
  Scope,
  Func,
  Ctx,
}
export interface Expression extends Base {
  scope: ExprScope;
  slabs: Slab[];
  err?: string;
}
export type Slab = Token | Expression | ExprMethod;

export interface ExprMethod extends Base {
  method: Expression;
  params: Expression[];
}

export type ElemSchema =
  | Text
  | Interpolated
  | ITag
  | IComment
  | LoopSchema
  | TreeSchema;
