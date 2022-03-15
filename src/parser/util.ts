import { AttSchema, Expression } from '../types';
import { parseExpression } from './parse-expression';

interface LoopAtts {
  pos?: string;
  index?: string;
  target: Expression;
}

function getAttDirectiveValue(
  name: string,
  atts: AttSchema[]
): string | undefined {
  return atts.find((att) => att.isDirective && att.name === name)?.value;
}

export function extractLoopAtts(atts: AttSchema[]): LoopAtts {
  const voidTarget = getVoidAttribute(atts)?.name.slice(1, -1);
  const index = getAttDirectiveValue('index', atts);
  const pos = getAttDirectiveValue('pos', atts);
  const loop = getAttDirectiveValue('loop', atts);
  const attTarget = getAttDirectiveValue('target', atts);
  const pretarget = voidTarget || loop || attTarget;
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
