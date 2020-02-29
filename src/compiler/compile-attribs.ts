import {
  RawTagSchema,
  matcherConst,
  matcherVar,
  AttType,
  AttSchema,
  AttribCompilers
} from '../common'

export function compileAttribs (schema: RawTagSchema): AttSchema[] {
  const { attribs } = schema
  const list: AttSchema[] = []
  Object.keys(attribs).forEach(att => {
    const value = attribs[att]
    const attType = getAttType(value)
    const compiler = compilers[attType]
    const compiled = compiler(att, value)
    list.push(compiled)
  })
  return list
}

function getAttType (value: string): AttType {
  return !value.match(matcherConst)
    ? 'plain'
    : value.match(matcherVar)
      ? 'variable'
      : 'constant'
}

const compilers: AttribCompilers = {
  plain: compileAttPlain,
  constant: compileAttConstant,
  variable: compileAttVariable
}

function compileAttPlain (att: string, value: string): AttSchema {
  return ['plain', att, value]
}

function compileAttConstant (att: string, value: string): AttSchema {
  const prop = (value.match(matcherConst) as [string, string])[1].trim()
  return ['constant', att, prop]
}

function compileAttVariable (att: string, value: string): AttSchema {
  const prop = (value.match(matcherVar) as [string, string])[1].trim()
  return ['variable', att, prop]
}
