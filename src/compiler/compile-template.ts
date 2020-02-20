import {
  RawSchema,
  ElemCompiler,
  ElemCompilers,
  ElemType,
  spreadTextFns
} from '../common'

import { compileTag } from './compile-tag'
import { compileText } from './compile-text'

const compilers: ElemCompilers = {
  tag: compileTag as ElemCompiler,
  text: compileText as ElemCompiler
}

export function compileTemplate (schemas: RawSchema[]) {
  const list: any = []
  schemas.forEach((schema: RawSchema) => {
    const compiler: ElemCompiler = compilers[schema.type as ElemType]
    const render = compiler(schema)
    list.push(render)
  })
  const children = spreadTextFns(list)
  return ['template', children]
}
