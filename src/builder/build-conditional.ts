import { buildChildren } from './build-children'

import {
  CondSchema
} from '../common'

export function buildConditional (schema: CondSchema): string {
  if (schema.kind === 'conditionalConst') {
    return schema.children.length === 1
      ? buildIfConst(schema)
      : buildIfElseConst(schema)
  } else {
    return schema.children.length === 1
      ? buildIfVar(schema)
      : buildIfElseVar(schema)
  }
}

function buildIfConst (schema: CondSchema) {
  const { conditions, children } = schema
  const builtChild = buildChildren([children[0]])[0]
  return `renderIfConst(${conditions[0]},${builtChild})`
}

function buildIfElseConst (schema: CondSchema) {
  const { conditions, children } = schema
  const builtChildren = buildChildren(children).join(',')
  return `renderIfElseConst(${conditions[0]},[${builtChildren}])`
}

function buildIfVar (schema: CondSchema) {
  const { conditions, children, variables } = schema
  const builtChild = buildChildren([children[0]])[0]
  return `renderIfVar(${conditions[0]},['${variables[0]}'],${builtChild})`
}

function buildIfElseVar (schema: CondSchema) {
  const { conditions, children, variables } = schema
  const builtChildren = buildChildren(children).join(',')
  return `renderIfElseVar(${conditions[0]},['${variables[0]}'],[${builtChildren}])`
}
