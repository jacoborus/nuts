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
    if (!tagHasConditional(schema)) {
      return schema
    }
    return transformConditional(schema as TagSchema)
  })
  return flattenTags(schemas)
}

function tagHasConditional (schema: ElemSchema): boolean {
  const { kind } = schema
  if (kind !== 'tag') return false
  return (schema as TagSchema).attribs
    .some(({ kind }) => kind === 'conditionalConst' || kind === 'conditionalVar')
}

export function transformConditional (schema: TagSchema): CondSchema {
  const attrib = getConditionalAttribute(schema.attribs)
  const kind = getMode(attrib)
  const value = getValue(attrib)
  const conditions = attrib.propName === '(if)'
    ? [getCondition(value)]
    : []
  const variables = [value]
  const tag = {
    kind: schema.kind,
    name: schema.name,
    attribs: cleanConditionalAttributes(schema),
    children: schema.children
  }
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
  return 'box => !!box.' + coalesced
}

export function cleanConditionalAttributes (schema: TagSchema): AttSchema[] {
  return schema.attribs.filter(att => att.propName !== '(if)' && att.propName !== '(else)')
}

function tagIsConditional (tag: ElemSchema): boolean {
  const kind = tag.kind
  return kind === 'conditionalConst' || kind === 'conditionalVar'
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
    lastConditional.children.push(tag.children[0])
  })
  return finalChildren
}
