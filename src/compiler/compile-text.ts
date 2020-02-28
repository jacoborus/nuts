import {
  RawTextSchema,
  TextChunkSchema,
  TextSchema
} from '../common'

const matcher = /{{([^}]*)}}/

export function compileText (schema: RawTextSchema): TextSchema {
  const str = schema.data || ''
  const compiled = compileChunk(str)
  return ['text', compiled]
}

function compileChunk (str: string, chunks: TextChunkSchema[] = []): TextChunkSchema[] {
  if (!str.length) return chunks
  const st = str.match(matcher)
  if (!st) {
    chunks.push(['plain', str])
    return chunks
  }
  if (st.index && st.index !== 0) {
    const out = str.substr(0, st.index)
    chunks.push(['plain', out])
    const rest = str.substr(st.index)
    return compileChunk(rest, chunks)
  }
  const prop = st[1].trim()
  const chunk: TextChunkSchema = prop.startsWith(':')
    ? ['variable', prop.substr(1).trim()]
    : ['constant', prop]
  chunks.push(chunk)
  const rest = str.substring(st[0].length)
  return compileChunk(rest, chunks)
}
