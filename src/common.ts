export const matcherConst = /{([^}]*)}/;
export const matcherVar = /{:([^}]*)}/;
export const matchDynamic = /{{([^}]*)}}/;

export type ConditionalMode = 'conditionalConst' | 'conditionalVar';
export type TextBuilder = (schema: TextSchema) => string;
export type TagBuilder = (schema: TagSchema) => string;
export type ElemBuilder = (schema: ElemSchema) => string;
export type NutBuilder = (schema: NutSchema) => string;

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

// TYPES
export type Attribs = { [index: string]: string };
export type ElemType = 'tag' | 'text' | 'nut';
export type NutType = ElemType | 'conditionalConst' | 'conditionalVar';
export type ChunkType = 'plain' | 'constant' | 'variable';
export type AttType =
  | 'plain'
  | 'constant'
  | 'variable'
  | 'booleanConst'
  | 'booleanVar'
  | 'event'
  | 'conditionalConst'
  | 'conditionalVar'
  | 'prop'
  | 'cssclass'
  | 'indexConst'
  | 'indexVar';

export type FinalAttType =
  | 'plain'
  | 'constant'
  | 'variable'
  | 'booleanConst'
  | 'booleanVar'
  | 'event'
  | 'cssclass';

// SCHEMAS
export interface AttSchema {
  kind: AttType;
  propName: string;
  value: string;
  variables: string[];
}

export interface CondSchema {
  kind: ConditionalMode;
  variables: string[];
  conditions: string[];
  children: ElemSchema[];
}

export interface TextSchema {
  kind: 'text';
  mode: ChunkType;
  literal: string;
  variables: string[];
}
export interface NutSchema {
  kind: 'nut';
  name: string;
  props: AttSchema[];
}
export interface TagSchema {
  kind: 'tag';
  name: string;
  attribs: AttSchema[];
  children: ElemSchema[];
}
export type ElemSchema = TextSchema | TagSchema | NutSchema | CondSchema;
export type ElemSchema2 = TextSchema & TagSchema & NutSchema & CondSchema;

// PARSERS
export type NutParser = (schema: RawNutSchema) => NutSchema;
export type TagParser = (schema: RawTagSchema) => TagSchema;
export type TextParser = (schema: RawTextSchema) => TextSchema;
export type ElemParser = (schema: RawSchema) => ElemSchema;
export type AttribParser = (att: string, value: string) => AttSchema;

export type ElemParsers = { [K in ElemType]: ElemParser };
export type AttribParsers = { [K in AttType]: AttribParser };

export interface ParseChunkOpts {
  str?: string;
  literal: string;
  variables: TextSchema['variables'];
}
