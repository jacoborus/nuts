export type Attribs = Record<string, string>;
// SCHEMAS
export type RawTextSchema = {
  type: 'text';
  data: string;
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

export interface TextSchema {
  type: 'text';
  value: string;
  dynamic: boolean;
  reactive: boolean;
  expr?: Expression;
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
  type: 'attribute';
  name: string;
  value: string;
  isBoolean: boolean;
  dynamic: boolean;
  reactive: boolean;
  expr?: Expression;
}

export type Attributes = AttSchema | EventSchema | DirAttSchema;

export interface EventSchema {
  type: 'event';
  name: string;
  value: string;
}

export interface DirAttSchema {
  type: 'directive';
  name: DirectiveName;
  value: string;
}

export interface TagSchema {
  type: 'tag';
  name: string;
  isVoid: boolean;
  ref?: string;
  events: EventSchema[];
  attributes: AttSchema[];
  children: FinalSchema[];
}

export interface SubCompSchema {
  type: 'component';
  name: string;
  ref?: string;
  events: EventSchema[];
  attributes: AttSchema[];
  children: FinalSchema[];
}

export interface TreeSchema {
  type: 'tree';
  requirement: Expression;
  yes: FinalSchema[];
  no: FinalSchema[];
}

export interface CondSchema {
  type: 'condition';
  condition: string;
  target: Expression;
  reactive: boolean;
  children: FinalSchema[];
}

export interface LoopSchema {
  type: 'loop';
  target: Expression;
  index?: string;
  pos?: string; // index + 1
  children: FinalSchema[];
}

export type DirectiveSchema = LoopSchema | CondSchema;
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
