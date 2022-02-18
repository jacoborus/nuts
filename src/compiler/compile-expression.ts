import { Expression, ExpressionChunk } from '../types';

// espressions will render inside functions which params are:
// - it:
//   - current scope
//   - expression without prefix: `uno.dos.tres`
// - scopes:
//   - [parentScope, parentOfParentScope, ...]
//   - expression with `../` prefix: `../uno.dos`
//   - subexpression with `../` interlaced: `uno.[../other].tres`
// - helpers:
//   - prefixed with `@`
// - globals:
//   - prefixed with `$`
//   - example: `$route.params.id`

export function compileExpression(expr: Expression): string {
  const first = expr.shift() as ExpressionChunk;
  let str = first.scope ? 'parent' : 'it';
  str = str + `?.${print(first.value)}`;
  expr.forEach((chunk) => {
    if (!chunk.scope) str = str + `?.${print(chunk.value)}`;
    else str = str + `?.[parent?.${print(chunk.value)}]`;
  });
  return str + '??""';
}

function print(str: string): string {
  return Number.isNaN(Number(str)) ? str : `["${str}"]`;
}
