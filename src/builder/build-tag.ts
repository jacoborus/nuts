import { buildText } from './build-text'
import { buildAttribs } from './build-attribs'
import { buildNut } from './build-nut'
import { buildConditional } from './build-conditional'

import {
  TagSchema,
  ElemSchema,
  NutType,
  ElemBuilder
} from '../common'

type Builders = {[ K in NutType ]: ElemBuilder}
const builders: Builders = {
  tag: buildTag as ElemBuilder,
  text: buildText as ElemBuilder,
  nut: buildNut as ElemBuilder,
  conditional: buildConditional as ElemBuilder
}

export function buildTag (schema: TagSchema): string {
  const { name, attribs, children } = schema
  const atts = buildAttribs(attribs)
  const childTags = buildChildren(children)
  return `renderTag('${name}',[${atts}],[${childTags}])`
}

function buildChildren (children: ElemSchema[]): string {
  const childTags = children.map(child => {
    const build = builders[child.kind]
    return build(child)
  })
  return childTags.join(',')
}
