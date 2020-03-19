export const matcherConst = /{([^}]*)}/
export const matcherVar = /{:([^}]*)}/

export type TextBuilder = (schema: TextSchema) => string
export type TagBuilder = (schema: TagSchema) => string
export type ElemBuilder = (schema: ElemSchema) => string
export type NutBuilder = (schema: NutSchema) => string

// TYPES
export interface Attribs {
  [ index: string ]: string
}

export type RawTextSchema = {
  type: string
  data: string
}
export type RawTagSchema = {
  type: string
  name: string
  attribs: Attribs
  children: RawSchema[]
}
export type RawNutSchema = {
  type: string
  name: string
  attribs: Attribs
}
export type RawSchema = RawTextSchema | RawTagSchema | RawNutSchema

export type ElemType = 'tag' | 'text' | 'nut'
export type ChunkType = 'plain' | 'constant' | 'variable'
export type AttType =
  'plain' |
  'constant' |
  'variable' |
  'booleanConst' |
  'booleanVar' |
  'event' |
  'conditionConst' |
  'conditionVar' |
  'prop' |
  'cssclass'

export type TextChunkType = ChunkType

// SCHEMAS
export interface AttSchema {
  kind: AttType
  propName: string
  value: string | number
  variables: string[]
}
export interface TextSchema {
  kind: 'text'
  mode: ChunkType
  literal: string
  variables: string[]
}
export interface TemplateSchema {
  kind: 'template'
  children: ElemSchema[]
}
export interface NutSchema {
  kind: 'nut'
  name: string
  // props: any
}
export interface TagSchema {
  kind: 'tag'
  name: string
  attribs: AttSchema[]
  children: ElemSchema[]
}
export type ElemSchema = TextSchema | TagSchema | NutSchema

// PARSERS
export type NutParser = (schema: RawNutSchema) => NutSchema
export type TagParser = (schema: RawTagSchema) => TagSchema
export type TextParser = (schema: RawTextSchema) => TextSchema
export type ElemParser = (schema: RawSchema) => ElemSchema
export type ElemParsers = {
  [ K in ElemType ]: ElemParser
}
export type AttribParsers = {
  [K in AttType]: (att: string, value: string) => AttSchema
}
export interface ParseChunkOpts {
  str?: string
  literal: string
  variables: TextSchema['variables']
}
