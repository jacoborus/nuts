import { ParseChunkOpts } from './common'

export const matcherConst = /{([^}]*)}/
export const matcherVar = /{:([^}]*)}/
export const matchTextConst = /{{([^}]*)}}/
export const matchTextVar = /{{:([^}]*)}}/

const matchers = {
  text: matchTextConst,
  attribute: matcherConst
}

type MatcherType = 'text' | 'attribute'

export function createStringParser (matcherType: MatcherType) {
  const match = matchers[matcherType]
  return function parseChunk ({ str = '', literal = '', variables = [] }: Partial<ParseChunkOpts>): ParseChunkOpts {
    if (!str.length) return { literal, variables }
    const st = str.match(match)
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
}
