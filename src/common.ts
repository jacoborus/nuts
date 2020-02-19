export const matcherConst = /{([^}]*)}/
export const matcherVar = /{:([^}]*)}/

// TYPES
export interface RawSchema {
  type: string
  name: string
  attribs: Attribs
  children: RawSchema[]
  data?: string
}

export type TextType = 'textFixed' | 'textConst' | 'textVar'
export type TextSchema = [TextType, string]
export type TextSchemas = TextSchema[]

export type TagSchema = ['tag', string, AttDef[], ElemSchema[]]

export type ElemSchema = TextSchema | TagSchema
export type ElemCompiler = (schema: RawSchema) => ElemSchema
export interface ElemCompilers {
  [ index: string ]: (schema: RawSchema) => ElemCompiler
}

export interface Attribs {
  [ index: string ]: string
}
export type AttType = 'plain' | 'constant' | 'variable'
export type AttDef = [AttType, string, string]
export type AttribCompilers = {
  [K in AttType]: (att: string, value: string) => AttDef
}
