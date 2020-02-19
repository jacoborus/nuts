export const matcherConst = /{([^}]*)}/
export const matcherVar = /{:([^}]*)}/

export interface Attribs {
  [ index: string ]: string
}

export interface Schema {
  type: string
  name: string
  attribs: Attribs
  children: Schema[]
  data?: string
}

export interface Compilers {
  [ index: string ]: (schema: Schema) => string
}

export interface Dict {
  [ index: string ]: any
}
