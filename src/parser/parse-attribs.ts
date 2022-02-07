import {
  RawNutSchema,
  RawTagSchema,
  AttSchema,
  EventSchema,
  DirAttSchema,
  DirectiveName,
  Attributes,
} from '../types';

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
): (AttSchema | EventSchema | DirAttSchema)[] {
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
  return {
    kind: 'attribute',
    name,
    isBoolean,
    value,
    dynamic,
    reactive,
  };
}

function parseEventAttribute(att: string, value: string): EventSchema {
  return { kind: 'event', name: att.slice(1), value };
}

function parseDirectiveAttribute(att: string, value: string): DirAttSchema {
  return {
    kind: 'directive',
    name: att.slice(1, -1) as DirectiveName,
    value: value,
  };
}

const booleanAttributes = [
  'async',
  'autofocus',
  'autoplay',
  'checked',
  'contenteditable',
  'controls',
  'default',
  'defer',
  'disabled',
  'formNoValidate',
  'frameborder',
  'hidden',
  'ismap',
  'itemscope',
  'loop',
  'multiple',
  'muted',
  'nomodule',
  'novalidate',
  'open',
  'readonly',
  'required',
  'reversed',
  'scoped',
  'selected',
  'typemustmatch',
];

export function getRegularAttributes(atts: Attributes[]): AttSchema[] {
  return atts.filter((att) => att.kind === 'attribute') as AttSchema[];
}

export function getRefAttribute(atts: Attributes[]) {
  return atts.find((att) => att.kind === 'directive' && att.name === 'ref');
}

export function getEventAttributes(atts: Attributes[]): EventSchema[] {
  return atts.filter((att) => att.kind === 'event') as EventSchema[];
}

export function getDirectiveAttributes(atts: Attributes[]): DirAttSchema[] {
  return atts.filter(
    (att) => att.kind === 'directive' && att.name !== 'ref'
  ) as DirAttSchema[];
}
