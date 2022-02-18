import { compileExpression } from './compile-expression';
import { TextSchema, Expression } from '../types';

export function compileText(chunk: TextSchema): string {
  if (!chunk.dynamic) return `() => ${chunk.value}`;
  const expr = compileExpression(chunk.expr as Expression);
  return '(it, parent) => ' + expr;
}
