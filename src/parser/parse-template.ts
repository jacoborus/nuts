import {
  RawSchema,
  ElemParser,
  ElemParsers,
  ElemType,
  TemplateSchema
} from '../common'

import { parseTag } from './parse-tag'
import { parseText } from './parse-text'

const parsers: ElemParsers = {
  tag: parseTag as ElemParser,
  text: parseText as ElemParser
}

export function parseTemplate (schemas: RawSchema[]): TemplateSchema {
  const list: any = []
  schemas.forEach((schema: RawSchema) => {
    const parser: ElemParser = parsers[schema.type as ElemType]
    const render = parser(schema)
    list.push(render)
  })
  return ['template', list]
}
