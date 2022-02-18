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
  kind: 'text';
  chunks: TextChunk[];
}

export interface TextChunk {
  value: string;
  dynamic: boolean;
  reactive: boolean;
  expr?: Expression;
}

export type Expression = {
  scope: number;
  value: string;
}[];

export type DirectiveName =
  | 'if'
  | 'else'
  | 'elseif'
  | 'ref'
  | 'loop'
  | 'index'
  | 'pos';

export type AttType = 'regular' | 'boolean';
export interface AttSchema {
  kind: 'attribute';
  name: string;
  value: string;
  isBoolean: boolean;
  dynamic: boolean;
  reactive: boolean;
}

export type Attributes = AttSchema | EventSchema | DirAttSchema;

export interface EventSchema {
  kind: 'event';
  name: string;
  value: string;
}

export interface DirAttSchema {
  kind: 'directive';
  name: DirectiveName;
  value: string;
}

export interface TagSchema {
  kind: 'tag';
  name: string;
  isVoid: boolean;
  ref?: string;
  events: EventSchema[];
  attributes: AttSchema[];
  children: ElemSchema[];
}

export interface SubCompSchema {
  kind: 'component';
  name: string;
  ref?: string;
  events: EventSchema[];
  attributes: AttSchema[];
  children: ElemSchema[];
}

export interface CondSchema {
  kind: 'condition';
  condition: string;
  target: string;
  reactive: boolean;
  children: ElemSchema[];
}

export interface LoopSchema {
  kind: 'loop';
  target: string;
  index?: string;
  pos?: string; // index + 1
  children: ElemSchema[];
}

export type DirectiveSchema = LoopSchema | CondSchema;
export type ElemSchema =
  | TextSchema
  | TagSchema
  | DirectiveSchema
  | SubCompSchema;
