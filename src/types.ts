import { SourceFile } from 'typescript';

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

export type Expression = ExpressionChunk[];
export interface ExpressionChunk {
  scope: number;
  value: string;
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

export interface AttSchema extends Item {
  type: NodeTypes.ATTRIBUTE;
  name: string;
  value: string;
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
