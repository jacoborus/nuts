import fs from 'fs'
import path from 'path'

import {
  ElemType,
  ElemBuilder,
  TemplateSchema,
  ElemSchema
} from '../common'

import { buildTag } from './build-tag'
import { buildText } from './build-text'

type Builders = {[ K in ElemType ]: ElemBuilder}

const pretemplate = fs.readFileSync(path.resolve(__dirname, './pre-template.txt'), 'UTF8')
const builders: Builders = {
  tag: buildTag as ElemBuilder,
  text: buildText as ElemBuilder
}

function printTemplate (children: string): string {
  return pretemplate + `export const render = renderTemplate([${children}])`
}

export function buildTemplate (schema: TemplateSchema): string {
  const children = buildChildren(schema[1])
  return printTemplate(children)
}

function buildChildren (children: ElemSchema[]): string {
  const childTags = children.map(child => {
    const builder: ElemBuilder = builders[child[0] as ElemType]
    return builder(child as ElemSchema)
  })
  return childTags.join(',')
}
