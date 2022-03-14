import { AttSchema, Expression } from '../types';
import { parseExpression } from './parse-expression';

interface LoopAtts {
  pos?: string;
  index?: string;
  target: Expression;
}

export function extractLoopAtts(atts: AttSchema[]): LoopAtts {
  const indexAtt = atts.find((att) => att.isDirective && att.name === 'index');
  const index = indexAtt ? indexAtt.value : undefined;
  const posAtt = atts.find((att) => att.isDirective && att.name === 'pos');
  const pos = posAtt ? posAtt.value : undefined;
  const pretarget = atts
    .find(
      ({ name, value }) =>
        name.startsWith('(') && name.endsWith(')') && value === ''
    )
    ?.name.slice(1, -1);
  const target = pretarget ? parseExpression(pretarget) : [];
  return { pos, index, target };
}
