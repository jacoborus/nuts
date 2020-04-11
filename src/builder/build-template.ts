import fs from 'fs'
import path from 'path'

import {
  TagSchema
} from '../common'

import { buildChildren } from './build-children'

export function buildTemplate (schema: TagSchema): string {
  const children = buildChildren(schema.children)[0]
  return printTemplate(children)
}

const pretemplate = fs.readFileSync(
  path.resolve(__dirname, './pre-template.txt'),
  'UTF8'
)

function printTemplate (child: string): string {
  return pretemplate + `export const { render, createNut } = renderTemplate(${child})`
}
