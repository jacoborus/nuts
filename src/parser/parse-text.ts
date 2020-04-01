import {
  RawTextSchema,
  ChunkType,
  TextSchema
} from '../common'
import { createStringParser } from '../tools'

const matchTextConst = /{{([^}]*)}}/
const matchTextVar = /{{:([^}]*)}}/

export function parseText (schema: RawTextSchema): TextSchema {
  const str = schema.data
  const mode = getTextMode(str)
  const parseChunk = createStringParser('text')
  const kind = 'text'
  const { literal, variables } = parseChunk({ str })
  return {
    kind,
    mode,
    literal,
    variables
  }
}

function getTextMode (str: string): ChunkType {
  if (str.match(matchTextVar)) return 'variable'
  if (str.match(matchTextConst)) return 'constant'
  return 'plain'
}
