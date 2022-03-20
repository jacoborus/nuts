import { AttSchema, Expression, TagSchema } from '../types';
import { parseExpression } from './parse-expression';
import { Reader } from './reader';

interface LoopAtts {
  pos?: string;
  index?: string;
  target: Expression;
}

export function clearAttDirectives(tag: TagSchema): TagSchema {
  const attributes = tag.attributes.filter((att) => !att.isDirective);
  return Object.assign({}, tag, { attributes });
}

function getAttDirectiveValue(
  name: string,
  atts: AttSchema[]
): AttSchema | undefined {
  return atts.find((att) => att.isDirective && att.name.value === name);
}

export function extractLoopAtts(atts: AttSchema[], reader: Reader): LoopAtts {
  const voidTarget = getVoidAttribute(atts);
  const index = getAttDirectiveValue('index', atts)?.value?.value;
  const pos = getAttDirectiveValue('pos', atts)?.value?.value;
  if (voidTarget) {
    return {
      pos,
      index,
      target: parseExpression(new Reader('', reader.source, voidTarget.start)),
    };
  }
  const loop = getAttDirectiveValue('loop', atts);
  const attTarget = getAttDirectiveValue('target', atts);
  const pretarget = loop || attTarget;
  if (!pretarget || !pretarget.value || !pretarget.value.expr) {
    throw new Error('loop missing target');
  }
  const target = pretarget.value.expr as Expression;
  return { pos, index, target };
}

export function extractTreeRequirement(
  atts: AttSchema[],
  reader: Reader
): Expression | undefined {
  const voidTarget = getVoidAttribute(atts);
  if (voidTarget) {
    return parseExpression(new Reader('', reader.source, voidTarget.start));
  }
  const target = atts.find(
    (att) => ['if', 'elseif'].includes(att.name.value) && att.isDirective
  );
  return target?.expr;
}

function getVoidAttribute(atts: AttSchema[]): AttSchema | undefined {
  return atts.find(({ isDirective, value }) => isDirective && !value);
}
