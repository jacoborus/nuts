import {
  Schema,
  matcherConst,
  matcherVar
} from '../common'

type AttType = 'plain' | 'constant' | 'variable'
type AttDef = [AttType, string, string]
type Compilers = {
  [K in AttType]: (att: string, value: string) => AttDef
}

export function compileAttribs (schema: Schema): AttDef[] {
  const { attribs } = schema
  const list: AttDef[] = []
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

const compilers: Compilers = {
  plain: compileAttPlain,
  constant: compileAttConstant,
  variable: compileAttVariable
}

function compileAttPlain (att: string, value: string): AttDef {
  return ['plain', att, value]
}

function compileAttConstant (att: string, value: string): AttDef {
  const prop = (value.match(matcherConst) as [string, string])[1].trim()
  return ['constant', att, prop]
}

function compileAttVariable (att: string, value: string): AttDef {
  const prop = (value.match(matcherVar) as [string, string])[1].trim()
  return ['variable', att, prop]
}
