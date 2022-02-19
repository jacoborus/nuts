import { compileExpression } from './compile-expression';
import { AttSchema, Expression } from '../types';

export function compileAttribs(atts: AttSchema[]): string {
  return atts
    .map((att) => {
      if (!att.dynamic) {
        return att.isBoolean
          ? compileBooleanStaticAtt(att)
          : compileStaticAtt(att);
      }
      return att.isBoolean
        ? compileBooleanDynamicAtt(att)
        : compileDynamicAtt(att);
    })
    .join('');
}

function compileStaticAtt(att: AttSchema): string {
  return ' ' + att.name + '="' + att.value + '"';
}

function compileBooleanStaticAtt(att: AttSchema): string {
  return ' ' + att.name;
}

function compileDynamicAtt(att: AttSchema): string {
  const expr = compileExpression(att.expr as Expression);
  return ' ' + att.name + '="${' + expr + ' ?? ""}"';
}

function compileBooleanDynamicAtt(att: AttSchema): string {
  const expr = compileExpression(att.expr as Expression);
  return '${' + expr + ' ? " ' + att.name + '" : "" }';
}
