import {
  CondSchema
} from '../common'

export function buildConditional (schema: CondSchema): string {
  return schema.kind
}
