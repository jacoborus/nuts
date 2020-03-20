import {
  RawNutSchema,
  RawTagSchema,
  matcherConst,
  matcherVar,
  AttSchema
} from '../common'
import { createStringParser } from '../tools'

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

function getAttType (att: string, value: string) {
  if (att === 'class') return 'cssclass'
  if (att.startsWith('@')) return 'event'
  if (att.startsWith(':')) return 'prop'
  if (att === '(if)' || att === '(elseif)' || att === '(else)') {
    return value.startsWith(':')
      ? 'conditionVar'
      : 'conditionConst'
  }
  if (att.endsWith('-')) {
    return value.startsWith(':')
      ? 'booleanVar'
      : 'booleanConst'
  }
  return !value.match(matcherConst)
    ? 'plain'
    : value.match(matcherVar)
      ? 'variable'
      : 'constant'
}

const parsers = {
  plain: parseAttPlain,
  constant: parseAttConstant,
  variable: parseAttVariable,
  booleanVar: parseBooleanVar,
  booleanConst: parseBooleanConst,
  event: parseAttEvent,
  conditionConst: parseCondConst,
  conditionVar: parseCondVar,
  prop: parseProp,
  cssclass: parseClass
}

function parseAttPlain (att: string, value: string): AttSchema {
  return {
    kind: 'plain',
    propName: att,
    value,
    variables: []
  }
}

function parseAttConstant (att: string, value: string): AttSchema {
  const parseStr = createStringParser('attribute')
  const { literal } = parseStr({ str: value.trim() })
  return {
    kind: 'constant',
    propName: att,
    value: literal,
    variables: []
  }
}

function parseAttVariable (att: string, value: string): AttSchema {
  const parseStr = createStringParser('attribute')
  const { literal, variables } = parseStr({ str: value.trim() })
  return {
    kind: 'variable',
    propName: att,
    value: literal,
    variables
  }
}

function parseAttEvent (att: string, value: string): AttSchema {
  const propName = att.slice(1)
  return {
    kind: 'event',
    propName,
    value: value.trim(),
    variables: []
  }
}

function parseBooleanConst (att: string, value: string): AttSchema {
  const propName = att.slice(0, -1)
  const val = value.trim()
  return {
    kind: 'booleanConst',
    propName,
    value: val,
    variables: []
  }
}

function parseBooleanVar (att: string, value: string): AttSchema {
  const propName = att.slice(0, -1)
  const val = value.trim().slice(1).trim()
  return {
    kind: 'booleanVar',
    propName,
    value: val,
    variables: [val]
  }
}

function parseCondConst (att: string, value: string): AttSchema {
  const propName = att.slice(0, -1).slice(1)
  return {
    kind: 'conditionConst',
    propName,
    value: value.trim(),
    variables: []
  }
}

function parseCondVar (att: string, value: string): AttSchema {
  const propName = att.slice(0, -1).slice(1)
  const val = value.trim().slice(1).trim()
  return {
    kind: 'conditionVar',
    propName,
    value: val,
    variables: [val]
  }
}

function parseProp (att: string, value: string): AttSchema {
  const propName = att.slice(1)
  const val = value.trim()
  return {
    kind: 'prop',
    propName,
    value: val,
    variables: [val]
  }
}

function parseClass (att: string, value: string): AttSchema {
  return {
    kind: 'cssclass',
    propName: att,
    value,
    variables: []
  }
}
