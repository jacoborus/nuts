import { parseAttribs } from './parse-attribs'
import { parseText } from './parse-text'
import { parseNut } from './parse-nut'
import { tagnames } from './tag-names'
import { parseConditional } from './parse-conditional'

import {
  RawSchema,
  RawTagSchema,
  TagSchema,
  ElemSchema,
  ElemType,
  ElemParser
} from '../common'

const parsers = {
  tag: parseTag as ElemParser,
  text: parseText as ElemParser,
  nut: parseNut as ElemParser
}

export function parseTag (schema: RawTagSchema): TagSchema {
  const { name } = schema
  const attribs = parseAttribs(schema)
  const preChildren = parseChildren(schema)
  const children = parseConditional(preChildren)
  return { kind: 'tag', name, attribs, children }
}

function parseChildren (schema: RawTagSchema): ElemSchema[] {
  const { children } = schema
  const list: ElemSchema[] = []
  children.forEach((childSchema: RawSchema) => {
    const elemType = getElemType(childSchema)
    const parser = parsers[elemType]
    const ast = parser(childSchema)
    list.push(ast)
  })
  return list
}

function getElemType (schema: RawSchema): ElemType {
  if ('name' in schema) {
    return tagnames.includes(schema.name)
      ? 'tag'
      : 'nut'
  }
  if (schema.type === 'text') return 'text'
  throw new Error('Wrong element type')
}
