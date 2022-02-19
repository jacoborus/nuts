import { LoopSchema, DirectiveSchema, TreeSchema } from '../types';
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

export function compileTree(directive: TreeSchema): string {
  const yes = compileChildren(directive.yes);
  const no = compileChildren(directive.no);
  const expr = compileExpression(directive.requirement);
  return '${' + expr + ' ? `' + yes + '` : `' + no + '`}';
}
