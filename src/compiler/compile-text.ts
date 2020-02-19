import {
  RawSchema,
  TextChunkSchema,
  TextSchema
} from '../common'

const matcher = /{([^}]*)}/

export function compileText (schema: Partial<RawSchema>): TextSchema {
  const str = schema.data || ''
  const compiled = compileChunk(str)
  return ['text', compiled]
}

function compileChunk (str: string, chunks: TextChunkSchema[] = []): TextChunkSchema[] {
  if (!str.length) return chunks
  const st = str.match(matcher)
  if (!st) {
    chunks.push(['textFixed', str])
    return chunks
  }
  if (st.index && st.index !== 0) {
    const out = str.substr(0, st.index)
    chunks.push(['textFixed', out])
    const rest = str.substr(st.index)
    return compileChunk(rest, chunks)
  }
  const prop = st[1].trim()
  const chunk: TextChunkSchema = prop.startsWith(':')
    ? ['textVar', prop.substr(1).trim()]
    : ['textConst', prop]
  chunks.push(chunk)
  const rest = str.substring(st[0].length)
  return compileChunk(rest, chunks)
}
