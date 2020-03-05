import { buildAttribs } from './build-attribs'

import {
  NutSchema
} from '../common'

export function buildNut (schema: NutSchema): string {
  const [, name, atts] = schema
  const attribs = buildAttribs(atts)
  return `renderNut('${name}',[${attribs}])`
}
