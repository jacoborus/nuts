import {
  RawTextSchema,
  TextChunkType,
  TextSchema
} from '../common'

interface ParseChunkOpts {
  str?: string
  literal: string
  variables: TextSchema['variables']
}

const matchTextConst = /{{([^}]*)}}/
const matchTextVar = /{{:([^}]*)}}/

export function parseText (schema: RawTextSchema): TextSchema {
  const str = schema.data
  const mode = getTextMode(str)
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

function parseChunk ({ str = '', literal = '', variables = [] }: Partial<ParseChunkOpts>): ParseChunkOpts {
  if (!str.length) return { literal, variables }
  const st = str.match(matchTextConst)
  if (!st) {
    return {
      literal: literal + str,
      variables
    }
  }
  if (st.index && st.index !== 0) {
    const out = str.substr(0, st.index)
    const rest = str.substr(st.index)
    return parseChunk({
      str: rest,
      literal: literal + out,
      variables
    })
  }
  let prop = st[1].trim()
  const rest = str.substring(st[0].length)
  const isVar = prop.startsWith(':')
  if (isVar) {
    prop = prop.substr(1).trim()
    variables.push(prop)
  }
  return parseChunk({
    str: rest,
    literal: literal + '${' + prop + '}',
    variables
  })
}
