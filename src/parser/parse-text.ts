import {
  RawTextSchema,
  TextChunkType,
  TextSchema
} from '../common'
import { createStringParser } from '../tools'

const matchTextConst = /{{([^}]*)}}/
const matchTextVar = /{{:([^}]*)}}/

export function parseText (schema: RawTextSchema): TextSchema {
  const str = schema.data
  const mode = getTextMode(str)
  const parseChunk = createStringParser('text')
  const { literal, variables } = parseChunk({ str })
  return {
    kind: 'text',
    mode,
    literal,
    variables
  }
}

function getTextMode (str: string): TextChunkType {
  if (str.match(matchTextVar)) return 'variable'
  if (str.match(matchTextConst)) return 'constant'
  return 'plain'
}
