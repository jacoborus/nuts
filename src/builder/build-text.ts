import {
  TextSchema,
  TextChunkType
} from '../common'

const textKinds: {[K in TextChunkType]: string} = {
  plain: 'renderTextPlain',
  constant: 'renderTextConstant',
  variable: 'renderTextVariable'
}

export function buildText (schema: TextSchema): string {
  const [, defs] = schema
  return defs.map(([kind, prop]) => {
    return `${textKinds[kind]}('${prop}')`
  })
    .join(',')
}
