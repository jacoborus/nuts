import {
  RawNutSchema,
  RawTagSchema,
  matcherConst,
  matcherVar,
  AttType,
  AttSchema,
  AttribParsers
} from '../common'

export function parseAttribs (schema: RawTagSchema | RawNutSchema): AttSchema[] {
  const { attribs } = schema
  const list: AttSchema[] = []
  Object.keys(attribs).forEach(att => {
    const value = attribs[att]
    const attType = getAttType(att, value)
    const parser = parsers[attType]
    const parsed = parser(att, value)
    list.push(parsed)
  })
  return list
}

function getAttType (att: string, value: string): AttType {
  if (att.startsWith('@')) return 'event'
  return !value.match(matcherConst)
    ? 'plain'
    : value.match(matcherVar)
      ? 'variable'
      : 'constant'
}

const parsers: AttribParsers = {
  plain: parseAttPlain,
  constant: parseAttConstant,
  variable: parseAttVariable,
  event: parseAttEvent
}

function parseAttPlain (att: string, value: string): AttSchema {
  return ['plain', att, value]
}

function parseAttConstant (att: string, value: string): AttSchema {
  const prop = (value.match(matcherConst) as [string, string])[1].trim()
  return ['constant', att, prop]
}

function parseAttVariable (att: string, value: string): AttSchema {
  const prop = (value.match(matcherVar) as [string, string])[1].trim()
  return ['variable', att, prop]
}

function parseAttEvent (att: string, value: string): AttSchema {
  const attName = att.slice(1)
  return ['event', attName, value]
}
