
import {
  Schema,
  matcherConst,
  matcherVar
} from '../common'

type AttType = 'attPlain' | 'attConst' | 'attVar'
type AttDef = [AttType, string, string]
type CompilerType = 'plain' | 'constant' | 'variable'
type Compilers = {
  [K in CompilerType]: (att: string, value: string) => AttDef
}

export function compileAttribs (schema: Schema) {
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

function getAttType (value: string): CompilerType {
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
  return ['attPlain', att, value]
}

function compileAttConstant (att: string, value: string): AttDef {
  const prop = (value.match(matcherConst) as [string, string])[1].trim()
  return ['attConst', att, prop]
}

function compileAttVariable (att: string, value: string): AttDef {
  const prop = (value.match(matcherVar) as [string, string])[1].trim()
  return ['attVar', att, prop]
}
