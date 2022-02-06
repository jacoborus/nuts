export type Attribs = Record<string, string>;
// SCHEMAS
export type RawTextSchema = {
  type: string;
  data: string;
};

export type RawTagSchema = {
  type: string;
  name: string;
  attribs: Attribs;
  children: RawSchema[];
};

export type RawNutSchema = {
  type: string;
  name: string;
  attribs: Attribs;
};

export type RawSchema = RawTextSchema | RawTagSchema | RawNutSchema;

export interface TextChunk {
  value: string;
  dynamic: boolean;
  reactive: boolean;
}

export interface TextSchema {
  kind: 'text';
  chunks: TextChunk[];
}

export type DirectiveName =
  | 'if'
  | 'else'
  | 'elseif'
  | 'ref'
  | 'each'
  | 'loop'
  | 'index';

export type AttType = 'regular' | 'boolean';
export interface AttSchema {
  kind: 'attribute';
  name: string;
  isBoolean: boolean;
  value: string;
  dynamic: boolean;
  reactive: boolean;
}

export interface EventSchema {
  kind: 'event';
  name: string;
  value: string;
}

export interface DirectiveSchema {
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
  directives: DirectiveSchema[];
  children: ElemSchema[];
}

export interface CompSchema {
  kind: 'component';
  name: string;
  attributes: AttSchema[];
  children: ElemSchema[];
}

export interface CondSchema {
  kind: 'condition';
  condition: string;
  dynamic: boolean;
  reactive: boolean;
  childrenTrue: ElemSchema[];
  childrenFalse: ElemSchema[];
}

export interface ForSchema {
  kind: 'for';
  target: string;
  item: string;
  index: string;
  children: ElemSchema[];
}

export interface LoopSchema {
  kind: 'loop';
  target: string;
  index: string;
  pos: string; // index + 1
  children: ElemSchema[];
}

export type ElemSchema = TextSchema | TagSchema | LoopSchema | CondSchema;
