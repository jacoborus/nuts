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
  return `renderIfConst(${conditions[0]},${children[0]})`
}

function buildIfElseConst (schema: CondSchema) {
  const { conditions, children } = schema
  return `renderIfElseConst(${conditions[0]},[${children.join(',')}])`
}

function buildIfVar (schema: CondSchema) {
  const { conditions, children, variables } = schema
  return `renderIfVar(${conditions[0]},[${variables[0]}],${children[0]})`
}

function buildIfElseVar (schema: CondSchema) {
  const { conditions, children, variables } = schema
  return `renderIfElseVar(${conditions[0]},[${variables[0]}],[${children.join(',')}])`
}
