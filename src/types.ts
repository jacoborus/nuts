import { SourceFile } from 'typescript';

export const enum Section {
  Literal = 'Literal',
  OpenTag = 'OpenTag',
  Script = 'Script',
  Style = 'Style',
  Doctype = 'Doctype',
  TagName = 'TagName',
  Attribs = 'Attribs',
  BeginAttribute = 'BeginAttribute',
  ClosingTag = 'ClosingTag',
  Expression = 'Expression',
  Comment = 'Comment',
  AfterOpenTag = 'AfterOpenTag',
  AttribName = 'AttribName',
  DirectiveName = 'DirectiveName',
  AfterAttribName = 'AfterAttribName',
  AttribValue = 'AttribValue',
  DQuoted = 'DQuoted',
  SQuoted = 'SQuoted',
  AttribExpression = 'AttribExpression',
  BeginExpression = 'BeginExpression',
  Identifier = 'Identifier',
  ExprMethod = 'ExprMethod',
  ExprQuoted = 'ExprQuoted',
  AfterExpression = 'AfterExpression',
}

interface IBase {
  start: number;
  end: number;
}

export interface IToken extends IBase {
  type: TokenKind;
  value: string;
}

export enum TokenKind {
  Beginning = 'Beginning',
  WhiteSpace = 'WhiteSpace',
  // html
  Literal = 'Literal',
  OpenTag = 'OpenTag', // '<'
  TagName = 'TagName', // '<' or '</'
  OpenTagEnd = 'OpenTagEnd', // '>',
  VoidTagEnd = 'VoidTagEnd', // '/>'
  CloseTag = 'CloseTag', // leading '</'
  Comment = 'Comment',
  Script = 'Script',
  AttrPrefix = 'AttrPrefix', // '@', ':' or '::'
  AttrName = 'AttrName',
  AttrEq = 'AttrEq',
  AttrQuote = 'AttrQuote',
  AttrValue = 'AttrValue',
  Directive = 'Directive',
  OpenComment = 'OpenComment',
  CloseComment = 'CloseComment',
  // Expression
  Identifier = 'Identifier',
  CtxPrefix = 'CtxPrefix', // $
  FuncPrefix = 'FuncPrefix', // @
  Dot = 'Dot', // .
  Comma = 'Comma', // ,
  OpenBracket = 'OpenBracket', // [
  CloseBracket = 'CloseBracket', // ]
  OpenCurly = 'OpenCurly', // {
  CloseCurly = 'CloseCurly', // }
  OpenParens = 'OpenParens', // (
  CloseParens = 'CloseParens', // )
  SQuote = 'SQuote', // '
  DQuote = 'DQuote', // "
  Unexpected = 'Unexpected',
}

export const enum NodeType {
  Comment,
  Text,
  TextDyn,
  Tag,
  Attr,
  AttrDyn, // Dynamic attribute
  Event,
  Loop,
  Tree,
  Script,
  Template,
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

export interface IText extends IBase {
  type: NodeType.Text;
  value: string;
}

export interface ITextDyn extends IBase {
  type: NodeType.TextDyn;
  expr: Expression;
  reactive: boolean;
}

export type IAllAttribs = IAttr | IAttrDyn | IEvent;

export interface IAttr extends IBase {
  type: NodeType.Attr;
  name: IToken;
  value?: IToken;
  isBoolean: boolean;
  err?: string;
}

export interface IAttrDyn extends IBase {
  type: NodeType.AttrDyn;
  name: IToken;
  expr: Expression;
  isBoolean: boolean;
  isReactive: boolean;
  err?: string;
}

export interface IEvent extends IBase {
  type: NodeType.Event;
  name: string;
  expr: Expression;
}

export interface ITag extends IBase {
  type: NodeType.Tag;
  name: string; // lower case tag name, div
  rawName: IToken; // original case tag name, Div
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
    | IText // with close tag
    | undefined // isVoid
    | null; // EOF before end or without close tag
}

export interface IComment extends IBase {
  type: NodeType.Comment;
  value: string;
}

export type DirectiveName =
  | 'if'
  | 'else'
  | 'elseif'
  | 'ref'
  | 'loop'
  | 'index'
  | 'pos';

export interface LoopSchema extends IBase {
  type: NodeType.Loop;
  loop: Expression;
  target: IToken;
  index?: IToken;
  pos?: IToken; // index + 1
  body: ElemSchema[];
}

export type TreeKind = 'if' | 'elseif' | 'else';
export interface TreeSchema extends IBase {
  type: NodeType.Tree;
  kind: TreeKind;
  condition: Expression;
  yes: ElemSchema[];
  no: ElemSchema[];
  reactive: boolean;
}

export interface ITemplate extends ITag {
  name: 'template';
}

export interface IScript extends Omit<ITag, 'type' | 'body'> {
  type: NodeType.Script;
  body: IText;
}

export interface CodeSchema extends Omit<ITag, 'type'> {
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
export interface Expression extends IBase {
  scope: ExprScope;
  slabs: Slab[];
  err?: string;
}
export type Slab = IToken | Expression | ExprMethod;

export interface ExprMethod extends IBase {
  method: Expression;
  params: Expression[];
}

export type ElemSchema =
  | IText
  | ITextDyn
  | ITag
  | IComment
  | LoopSchema
  | TreeSchema;
