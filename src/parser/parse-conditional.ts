import {
  ElemSchema,
  CondSchema,
  AttSchema,
  TagSchema
} from '../common'

import { coalesceDots } from '../tools'

type Mode = 'conditionalConst' | 'conditionalVar'

export function parseConditional (children: ElemSchema[]): ElemSchema[] {
  const schemas = children.map(schema => {
    if (!tagIsConditional(schema)) {
      return schema
    }
    return transformConditional(schema as TagSchema)
  })
  return flattenTags(schemas)
}

function tagIsConditional (schema: ElemSchema): boolean {
  const { kind } = schema
  if (kind === 'text' || kind === 'nut') return false
  return (schema as TagSchema).attribs
    .some(({ kind }) => kind === 'conditionalConst' || kind === 'conditionalVar')
}

export function transformConditional (schema: TagSchema): CondSchema {
  const attrib = getConditionalAttribute(schema.attribs)
  const kind = getMode(attrib)
  const value = getValue(attrib)
  const conditions = schema.name === '(if)'
    ? [getCondition(value)]
    : []
  const variables = [value]
  const tag = cleanConditionalTag(schema, attrib)
  return {
    kind,
    conditions,
    variables,
    children: [tag]
  }
}

function getConditionalAttribute (attribs: AttSchema[]): AttSchema {
  return attribs.find(({ kind }) => {
    return kind === 'conditionalConst' || kind === 'conditionalVar'
  }) as AttSchema
}

function getMode (attrib: AttSchema): Mode {
  return attrib.kind === 'conditionalConst'
    ? 'conditionalConst'
    : 'conditionalVar'
}

export function getValue (attrib: AttSchema): string {
  const { value } = attrib
  return value.startsWith(':')
    ? value.slice(1).trim()
    : value.trim()
}

export function getCondition (value: string): string {
  const coalesced = coalesceDots(value)
  return 'box => `box.' + coalesced + '`'
}

export function cleanConditionalTag (schema: TagSchema, attrib: AttSchema): TagSchema {
  schema.attribs = schema.attribs.filter(att => att !== attrib)
  return schema
}

export function flattenTags (children: ElemSchema[]): ElemSchema[] {
  const finalChildren: ElemSchema[] = []
  let lastConditional: CondSchema | false = false
  children.forEach(schema => {
    if (!tagIsConditional(schema)) {
      lastConditional = false
      return finalChildren.push(schema)
    }
    if (!lastConditional) {
      lastConditional = schema as CondSchema
      return finalChildren.push(schema)
    }
    const tag = schema as CondSchema
    lastConditional.variables.push(...tag.variables)
    lastConditional.conditions.push(...tag.conditions)
    lastConditional.children.push(...tag.children)
  })
  return finalChildren
}
