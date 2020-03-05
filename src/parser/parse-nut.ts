import { parseAttribs } from './parse-attribs'

import {
  NutSchema,
  RawNutSchema
} from '../common'

export function parseNut (schema: RawNutSchema): NutSchema {
  const { name } = schema
  const attribs = parseAttribs(schema)
  return ['nut', name, attribs]
}
