import { parseAttribs } from './parse-attribs'
import { parseText } from './parse-text'
import { parseNut } from './parse-nut'
import { tagnames } from './tag-names'

import {
  RawSchema,
  RawTagSchema,
  TagSchema,
  ElemSchema,
  ElemType,
  ElemParser,
  ElemParsers
} from '../common'

const parsers: ElemParsers = {
  tag: parseTag as ElemParser,
  text: parseText as ElemParser,
  nut: parseNut as ElemParser
}

export function parseTag (schema: RawTagSchema): TagSchema {
  const { name } = schema
  const attribs = parseAttribs(schema)
  const children = parseChildren(schema)
  return { kind: 'tag', name, attribs, children }
}

function parseChildren (schema: RawTagSchema): ElemSchema[] {
  const { children } = schema
  const list: ElemSchema[] = []
  children.forEach((childSchema: RawSchema) => {
    const elemType = getElemType(childSchema)
    const parser = parsers[elemType]
    const render = parser(childSchema)
    list.push(render)
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
