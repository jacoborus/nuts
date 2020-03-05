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
export type AttType = ChunkType | 'event'
export type TextChunkType = ChunkType

export type AttSchema = [AttType, string, string]
export type AttribParsers = {
  [K in AttType]: (att: string, value: string) => AttSchema
}

export type TextChunkSchema = [TextChunkType, string]
export type TextSchema = ['text', TextChunkSchema[]]
export type TemplateSchema = ['template', ElemSchema[]]
export type NutSchema = ['nut', string, AttSchema[]]
export type TagSchema = ['tag', string, AttSchema[], ElemSchema[]]
export type ElemSchema = TextSchema | TagSchema | NutSchema

export type NutParser = (schema: RawNutSchema) => NutSchema
export type TagParser = (schema: RawTagSchema) => TagSchema
export type TextParser = (schema: RawTextSchema) => TextSchema
export type ElemParser = (schema: RawSchema) => ElemSchema
export type ElemParsers = {
  [ K in ElemType ]: ElemParser
}
