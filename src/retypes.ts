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

export type AttType = 'regular' | 'boolean';
export interface AttSchema {
  kind: AttType;
  name: string;
  value: string;
  dynamic: boolean;
  reactive: boolean;
}

export interface TagSchema {
  kind: 'tag';
  name: string;
  attributes: AttSchema[];
  children: ElemSchema[];
  isVoid: boolean;
  ref?: string;
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
  children: ElemSchema[];
}

export type ElemSchema = TextSchema | TagSchema | LoopSchema | CondSchema;
