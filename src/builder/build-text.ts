import {
  TextSchema,
  ChunkType
} from '../common'

const textKinds: {[K in ChunkType]: string} = {
  plain: 'renderTextPlain',
  constant: 'renderTextConstant',
  variable: 'renderTextVariable'
}

const builders = {
  plain: buildTextPlain,
  constant: buildTextConst,
  variable: buildTextVar
}

export function buildText (schema: TextSchema) {
  const { mode } = schema
  return builders[mode](schema)
}

export function buildTextPlain (schema: TextSchema): string {
  const { mode, literal } = schema
  const fn = textKinds[mode]
  return fn + `('${literal}')`
}

export function buildTextConst (schema: TextSchema): string {
  const { mode, literal } = schema
  const fn = textKinds[mode]
  return fn + '(box => `' + literal + '`, [])'
}

export function buildTextVar (schema: TextSchema): string {
  const { mode, literal, variables } = schema
  const fn = textKinds[mode]
  return fn + '(box => `' + literal + "`, ['" + variables.join("','") + "'])"
}
