import fs from 'fs'
import path from 'path'

import {
  ElemType,
  ElemBuilder,
  TagSchema,
  ElemSchema
} from '../common'

import { buildTag } from './build-tag'
import { buildText } from './build-text'
import { buildNut } from './build-nut'

type Builders = {[ K in ElemType ]: ElemBuilder}

export function buildTemplate (schema: TagSchema): string {
  const rawChildren = schema.children
  const children = buildChildren(rawChildren)
  return printTemplate(children)
}

const pretemplate = fs.readFileSync(
  path.resolve(__dirname, './pre-template.txt'),
  'UTF8'
)

const builders: Builders = {
  tag: buildTag as ElemBuilder,
  text: buildText as ElemBuilder,
  nut: buildNut as ElemBuilder
}

function printTemplate (children: string): string {
  return pretemplate + `export const render = renderTemplate([${children}])`
}

function buildChildren (children: ElemSchema[]): string {
  const childTags = children.map(child => {
    const builder: ElemBuilder = builders[child.kind]
    return builder(child as ElemSchema)
  })
  return childTags.join(',')
}
