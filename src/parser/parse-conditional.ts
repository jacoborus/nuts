import {
  ElemSchema,
  CondSchema,
  AttSchema,
  TagSchema
} from '../common'

type Mode = 'constant' | 'variable'
const attNames = ['(if)', '(elseif)', '(else)', '(:if)']

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
  console.log(schema)
  const hasCondition = (schema as TagSchema).attribs.some(att => attIsCond(att.propName))
  return hasCondition
}

export function transformConditional (schema: TagSchema): CondSchema {
  const mode = getMode(schema.attribs)
  const condition = getValue(schema.attribs)
  const variables = getVariables(condition)
  const tag = cleanConditionalTag(schema)
  return {
    kind: 'conditional',
    mode,
    conditions: [condition],
    variables,
    children: [tag]
  }
}

export function getMode (attribs: AttSchema[]): Mode {
  return attribs.some(att => att.propName === (':if'))
    ? 'variable'
    : 'constant'
}

export function getValue (attribs: AttSchema[]): string {
  const attrib = attribs.find(att => attIsCond(att.propName))
  return attrib ? attrib.value.trim() : ''
}

function attIsCond (att = ''): boolean {
  return attNames.some(attName => attName === att)
}

export function getConditionalStep (attribs: AttSchema[]): string {
  const attrib = attribs.find(att => attIsCond(att.propName))
  return attrib ? attrib.propName : '(if)'
}

export function getVariables (str: string): string[] {
  // TODO
  // TODO
  // TODO
  // TODO
  return str.trim().split('.')
}

export function cleanConditionalTag (schema: TagSchema): TagSchema {
  schema.attribs = schema.attribs.filter(attrib => !attIsCond(attrib.propName))
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
