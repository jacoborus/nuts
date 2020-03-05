import { buildText } from './build-text'
import { buildAttribs } from './build-attribs'
import { buildNut } from './build-nut'

import {
  TagSchema,
  ElemSchema,
  ElemType,
  ElemBuilder
} from '../common'

type Builders = {[ K in ElemType ]: ElemBuilder}
const builders: Builders = {
  tag: buildTag as ElemBuilder,
  text: buildText as ElemBuilder,
  nut: buildNut as ElemBuilder
}

export function buildTag (schema: TagSchema): string {
  const [, name, atts, children] = schema
  const attribs = buildAttribs(atts)
  const childTags = buildChildren(children)
  return `renderTag('${name}',[${attribs}],[${childTags}])`
}

function buildChildren (children: ElemSchema[]): string {
  const childTags = children.map(child => {
    const builder: ElemBuilder = builders[child[0]]
    return builder(child as ElemSchema)
  })
  return childTags.join(',')
}
