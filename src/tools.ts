import {
  ParseChunkOpts
} from './common'

export const matcherConst = /{([^}]*)}/
export const matcherVar = /{:([^}]*)}/
export const matchTextConst = /{{([^}]*)}}/
export const matchTextVar = /{{:([^}]*)}}/

const matchers = {
  text: matchTextConst,
  attribute: matcherConst
}

type MatcherType = 'text' | 'attribute'

export const orNothing = " ?? ''"

export function coalesceDots (str: string): string {
  const arr = str.split('.')
  if (arr.length === 1) return str + orNothing
  return arr.join('?.') + orNothing
}

export function createStringParser (matcherType: MatcherType) {
  const match = matchers[matcherType]
  return function parseChunk ({ str = '', literal = '', variables = [] }: Partial<ParseChunkOpts>): ParseChunkOpts {
    if (!str.length) {
      // empty string
      return { literal, variables }
    }
    const st = str.match(match)
    if (!st) {
      // plain text
      return {
        literal: literal + str,
        variables
      }
    }
    if (st.index && st.index !== 0) {
      // plain chunk before interpolation
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
    const isVariable = prop.startsWith(':')
    if (isVariable) {
      // variable chunk
      prop = prop.substr(1).trim()
      variables.push(prop)
    }
    // variable and constant
    return parseChunk({
      str: rest,
      literal: literal + '${box.' + coalesceDots(prop) + '}',
      variables
    })
  }
}
