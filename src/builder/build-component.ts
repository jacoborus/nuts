import { readFileSync } from 'fs'
import { resolve } from 'path'
import {
  TemplateSchema
} from '../common'

import { buildTemplate } from './build-template'

const pretemplatePath = resolve(__dirname, 'pre-template.txt')
const pretemplate = readFileSync(pretemplatePath, 'UTF8')

export function buildComponent (schema: TemplateSchema) {
  const templateString = buildTemplate(schema)
  return pretemplate + templateString
}
