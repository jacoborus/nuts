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
  const voidTarget = getVoidAttribute(atts)?.name.slice(1, -1);
  const attTarget = atts.find(
    (att) => att.name === 'target' && att.isDirective
  )?.value;
  const pretarget = voidTarget || attTarget;
  const target = pretarget ? parseExpression(pretarget) : [];
  return { pos, index, target };
}

export function extractTreeRequirement(atts: AttSchema[]): Expression {
  const voidTarget = getVoidAttribute(atts)?.name.slice(1, -1);
  const pretarget = atts.find(
    (att) => ['if', 'elseif'].includes(att.name) && att.isDirective
  )?.value;
  const target = voidTarget || pretarget;
  return target ? parseExpression(target) : [];
}

function getVoidAttribute(atts: AttSchema[]): AttSchema | undefined {
  return atts.find(
    ({ name, value }) =>
      name.startsWith('(') && name.endsWith(')') && value === ''
  );
}
