import fs from 'fs'
import path from 'path'

import {
  NutType,
  ElemBuilder,
  TagSchema,
  ElemSchema
} from '../common'

import { buildTag } from './build-tag'
import { buildText } from './build-text'
import { buildNut } from './build-nut'
import { buildConditional } from './build-conditional'

type Builders = {[ K in NutType ]: ElemBuilder}

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
  nut: buildNut as ElemBuilder,
  conditionalConst: buildConditional as ElemBuilder,
  conditionalVar: buildConditional as ElemBuilder
}

function printTemplate (children: string): string {
  return pretemplate + `export const { render, createNut } = renderTemplate([${children}])`
}

function buildChildren (children: ElemSchema[]): string {
  const childTags = children.map(child => {
    const builder: ElemBuilder = builders[child.kind]
    return builder(child as ElemSchema)
  })
  return childTags.join(',')
}
