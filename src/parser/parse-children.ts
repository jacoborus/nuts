import { parseText } from './parse-text'
import { parseNut } from './parse-nut'
import { parseTag } from './parse-tag'
import { tagnames } from './tag-names'

import {
  RawSchema,
  RawTagSchema,
  ElemSchema,
  ElemType,
  ElemParser
} from '../common'

const parsers = {
  tag: parseTag as ElemParser,
  text: parseText as ElemParser,
  nut: parseNut as ElemParser
}

export function parseChildren (schema: RawTagSchema): ElemSchema[] {
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
