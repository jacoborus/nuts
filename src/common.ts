export const matcherConst = /{([^}]*)}/
export const matcherVar = /{:([^}]*)}/

export type ChunkType = 'plain' | 'constant' | 'variable'
// TYPES
export type ElemType = 'tag' | 'text'
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
export type RawSchema = RawTextSchema | RawTagSchema

export type TextChunkType = ChunkType
export type TextChunkSchema = [TextChunkType, string]
export type TextSchema = ['text', TextChunkSchema[]]

export interface Attribs {
  [ index: string ]: string
}
export type AttType = ChunkType
export type AttDef = [AttType, string, string]
export type AttribCompilers = {
  [K in AttType]: (att: string, value: string) => AttDef
}

export type TagSchema = ['tag', string, AttDef[], ElemSchema[]]
export type ElemSchema = TextSchema | TagSchema
export type ElemCompiler = (schema: RawSchema) => ElemSchema
export type ElemCompilers = {
  [ K in ElemType ]: ElemCompiler
}
