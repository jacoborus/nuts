import {
  RawSchema,
  TextSchema,
  TextSchemas
} from '../common'

const matcher = /{([^}]*)}/

export function compileText (schema: Partial<RawSchema>): TextSchemas {
  const str = schema.data || ''
  const compiled = compileChunk(str)
  return compiled
}

function compileChunk (str: string, fns: TextSchemas = []): TextSchemas {
  if (!str.length) return fns
  const st = str.match(matcher)
  if (!st) {
    fns.push(['textFixed', str])
    return fns
  }
  if (st.index && st.index !== 0) {
    const out = str.substr(0, st.index)
    fns.push(['textFixed', out])
    const rest = str.substr(st.index)
    return compileChunk(rest, fns)
  }
  const prop = st[1].trim()
  const fn: TextSchema = prop.startsWith(':')
    ? ['textVar', prop.substr(1).trim()]
    : ['textConst', prop]
  fns.push(fn)
  const rest = str.substring(st[0].length)
  return compileChunk(rest, fns)
}
