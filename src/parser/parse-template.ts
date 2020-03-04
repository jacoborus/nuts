import {
  RawSchema,
  ElemCompiler,
  ElemCompilers,
  ElemType,
  TemplateSchema
} from '../common'

import { parseTag } from './parse-tag'
import { parseText } from './parse-text'

const parsers: ElemCompilers = {
  tag: parseTag as ElemCompiler,
  text: parseText as ElemCompiler
}

export function parseTemplate (schemas: RawSchema[]): TemplateSchema {
  const list: any = []
  schemas.forEach((schema: RawSchema) => {
    const parser: ElemCompiler = parsers[schema.type as ElemType]
    const render = parser(schema)
    list.push(render)
  })
  return ['template', list]
}
