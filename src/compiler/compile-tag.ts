import {
  RawSchema,
  RawTagSchema,
  TagSchema,
  ElemSchema,
  ElemType,
  ElemCompiler,
  ElemCompilers
} from '../common'

import { compileAttribs } from './compile-attribs'
import { compileText } from './compile-text'

const compilers: ElemCompilers = {
  tag: compileTag as ElemCompiler,
  text: compileText as ElemCompiler
}

export function compileTag (schema: RawTagSchema): TagSchema {
  const { name } = schema
  const attribs = compileAttribs(schema)
  const children = compileChildren(schema)
  return ['tag', name, attribs, children]
}

function compileChildren (schema: RawTagSchema): ElemSchema[] {
  const { children } = schema
  const list: any[] = []
  children.forEach((childSchema: RawSchema) => {
    const compiler: ElemCompiler = compilers[childSchema.type as ElemType]
    if (!compiler) console.log(childSchema.type)
    const render = compiler(childSchema)
    list.push(render)
  })
  return spreadTextFns(list)
}

function spreadTextFns (list: any[]): ElemSchema[] {
  const final: ElemSchema[] = []
  list.forEach(elem => {
    if (elem.type !== 'text') final.push(elem)
    else final.push(...elem)
  })
  return final
}
