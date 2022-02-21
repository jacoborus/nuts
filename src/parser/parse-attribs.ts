import {
  RawNutSchema,
  RawTagSchema,
  AttSchema,
  EventSchema,
  DirAttSchema,
  DirectiveName,
  Attributes,
  NodeTypes,
} from '../types';

import { booleanAttributes } from '../common';
import { parseExpression } from './parse-expression';

const directives = [
  '(if)',
  '(else)',
  '(elseif)',
  '(ref)',
  '(loop)',
  '(index)',
  '(pos)',
];

export function parseAttribs(
  schema: RawTagSchema | RawNutSchema
): Attributes[] {
  const { attribs } = schema;
  return Object.keys(attribs).map((att) => {
    const value = attribs[att].trim();
    const attType = getAttType(att);
    if (attType === 'static' || attType === 'dynamic') {
      return parseRegularAttribute(att, value);
    } else if (attType === 'event') {
      return parseEventAttribute(att, value);
    } else return parseDirectiveAttribute(att, value);
  });
}

function getAttType(att: string) {
  if (att.startsWith(':')) return 'dynamic';
  if (att.startsWith('@')) return 'event';
  if (directives.includes(att)) return 'directive';
  return 'static';
}

function parseRegularAttribute(att: string, value: string): AttSchema {
  const reactive = att.startsWith('::');
  const dynamic = att.startsWith(':');
  const name = reactive ? att.slice(2) : dynamic ? att.slice(1) : att;
  const isBoolean = booleanAttributes.includes(name);
  const expr = dynamic ? parseExpression(value) : undefined;
  return {
    type: NodeTypes.ATTRIBUTE,
    name,
    isBoolean,
    value,
    dynamic,
    reactive,
    expr,
  };
}

export function splitAttribs(schema: RawTagSchema | RawNutSchema) {
  const attribs = parseAttribs(schema);
  return {
    ref: getRefAttribute(attribs),
    events: getEventAttributes(attribs),
    attributes: getRegularAttributes(attribs),
    directives: getDirectiveAttributes(attribs),
  };
}

function parseEventAttribute(att: string, value: string): EventSchema {
  return { type: NodeTypes.EVENT, name: att.slice(1), value };
}

function parseDirectiveAttribute(att: string, value: string): DirAttSchema {
  return {
    type: NodeTypes.DIRECTIVE,
    name: att.slice(1, -1) as DirectiveName,
    value: value,
  };
}

export function getRegularAttributes(atts: Attributes[]): AttSchema[] {
  return atts.filter((att) => att.type === NodeTypes.ATTRIBUTE) as AttSchema[];
}

export function getRefAttribute(atts: Attributes[]) {
  return atts.find(
    (att) => att.type === NodeTypes.DIRECTIVE && att.name === 'ref'
  )?.value;
}

export function getEventAttributes(atts: Attributes[]): EventSchema[] {
  return atts.filter((att) => att.type === NodeTypes.EVENT) as EventSchema[];
}

export function getDirectiveAttributes(atts: Attributes[]): DirAttSchema[] {
  return atts.filter(
    (att) => att.type === NodeTypes.DIRECTIVE && att.name !== 'ref'
  ) as DirAttSchema[];
}
