export const enum NodeTypes {
  TEXT,
  TAG,
  ATTRIBUTE,
  LOOP,
  TREE,
  CONDITIONAL,
  COMPONENT,
  DIRECTIVE,
  EVENT,
}

export type Attribs = Record<string, string>;
// SCHEMAS
export type RawTextSchema = {
  type: 'text';
  data: string;
  start: number;
};

export type RawTagSchema = {
  type: 'tag';
  name: string;
  attribs: Attribs;
  children: RawSchema[];
};

export type RawNutSchema = {
  type: 'tag';
  name: string;
  attribs: Attribs;
  children: RawSchema[];
};

export type RawSchema = RawTextSchema | RawTagSchema | RawNutSchema;

interface Loc {
  line: number;
  column: number;
}

export interface TextSchema {
  type: NodeTypes.TEXT;
  value: string;
  dynamic: boolean;
  reactive: boolean;
  expr?: Expression;
  start: number;
}

export type Expression = ExpressionChunk[];

export interface ExpressionChunk {
  scope: number;
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

export interface AttSchema {
  type: NodeTypes.ATTRIBUTE;
  name: string;
  value: string;
  isBoolean: boolean;
  dynamic: boolean;
  reactive: boolean;
  expr?: Expression;
}

export type Attributes = AttSchema | EventSchema | DirAttSchema;

export interface EventSchema {
  type: NodeTypes.EVENT;
  name: string;
  value: string;
}

export interface DirAttSchema {
  type: NodeTypes.DIRECTIVE;
  name: DirectiveName;
  value: string;
}

export interface TagSchema {
  type: NodeTypes.TAG;
  name: string;
  isVoid: boolean;
  ref?: string;
  events: EventSchema[];
  attributes: AttSchema[];
  children: ElemSchema[];
}

export interface SubCompSchema {
  type: NodeTypes.COMPONENT;
  name: string;
  ref?: string;
  events: EventSchema[];
  attributes: AttSchema[];
  children: FinalSchema[];
}

export type TreeKind = 'if' | 'elseif' | 'else';
export interface TreeSchema {
  type: NodeTypes.TREE;
  kind: TreeKind;
  requirement: Expression;
  yes: FinalSchema[];
  no: FinalSchema[];
  reactive: boolean;
}

export interface LoopSchema {
  type: NodeTypes.LOOP;
  target: Expression;
  index?: string;
  pos?: string; // index + 1
  children: FinalSchema[];
}

export type DirectiveSchema = LoopSchema | TreeSchema;
export type ElemSchema =
  | TextSchema
  | TagSchema
  | DirectiveSchema
  | SubCompSchema;
export type FinalSchema =
  | TextSchema
  | TagSchema
  | LoopSchema
  | TreeSchema
  | SubCompSchema;

export interface ScriptSchema {
  name: string;
  lang: string;
  value: string;
}

export interface ComponentSchema {
  template: TemplateSchema;
  scripts: ScriptSchema[];
}

export interface TemplateSchema {
  name: string;
  schema: ElemSchema[];
}
