import { parseAttribs } from './parse-attribs'
import { parseText } from './parse-text'

import {
  RawSchema,
  RawTagSchema,
  TagSchema,
  ElemSchema,
  ElemType,
  ElemCompiler,
  ElemCompilers
} from '../common'

const parsers: ElemCompilers = {
  tag: parseTag as ElemCompiler,
  text: parseText as ElemCompiler
}

export function parseTag (schema: RawTagSchema): TagSchema {
  const { name } = schema
  const attribs = parseAttribs(schema)
  const children = parseChildren(schema)
  return ['tag', name, attribs, children]
}

function parseChildren (schema: RawTagSchema): ElemSchema[] {
  const { children } = schema
  const list: any[] = []
  children.forEach((childSchema: RawSchema) => {
    const parser: ElemCompiler = parsers[childSchema.type as ElemType]
    const render = parser(childSchema)
    list.push(render)
  })
  return list
}
