import { readFileSync } from 'fs'
import { resolve } from 'path'
import {
  TemplateSchema
} from '../common'

import { buildTemplate } from './build-template'

const pretemplatePath = resolve(__dirname, '../../src/builder/pre-template.txt')
const pretemplate = readFileSync(pretemplatePath, 'UTF8')
const lastLine = 'export const render = renderComponent('

export function buildComponent (schema: TemplateSchema) {
  const templateString = buildTemplate(schema)
  return pretemplate + lastLine + templateString + "')'"
}
