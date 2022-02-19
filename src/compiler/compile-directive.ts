import { LoopSchema, DirectiveSchema, CondSchema } from '../types';
import { compileChildren } from './compile-tag';
import { compileExpression } from './compile-expression';

export function compileDirective(directive: DirectiveSchema): string {
  // if (directive.type === 'loop') return compileLoop(directive);
  return compileLoop(directive as LoopSchema);
  // return compileConditional(directive as CondSchema);
}

export function compileLoop(directive: LoopSchema): string {
  const children = compileChildren(directive.children);
  const expr = compileExpression(directive.target);
  return (
    '${(' +
    expr +
    ' || []).map(item => {const parent = [it], it = item;return `' +
    children +
    '`}).join("")}'
  );
}

// export function compileConditional(directive: CondSchema): string {
//   const children = compileChildren(directive.children);
//   const expr = compileExpression(directive.target);
//   // TODO: continue here
//   // TODO: continue here
//   return (
//     '${(' +
//     expr +
//     ' || []).map(item => {/n' +
//     'const parent = [it], it = item;' +
//     'return `' +
//     children +
//     '`' +
//     '}).join("")}'
//   );
// }
