import { compileExpression } from './compile-expression';
import { AttSchema, Expression } from '../types';

export function compileAttribs(atts: AttSchema[]): string {
  return (
    '`' +
    atts
      .map((att) => {
        if (!att.dynamic) return ' ' + att.name + '="' + att.value + '"';
        const expr = compileExpression(att.expr as Expression);
        return ' ' + att.name + '="${' + expr + '}"';
      })
      .join('') +
    '`'
  );
}
