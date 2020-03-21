import { buildProps } from './build-props'

import {
  NutSchema
} from '../common'

export function buildNut (schema: NutSchema): string {
  const { name, props } = schema
  const finalProps = buildProps(props)
  return `renderNut('${name}',[${finalProps}])`
}
