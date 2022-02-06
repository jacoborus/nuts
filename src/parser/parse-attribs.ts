import {
  RawNutSchema,
  RawTagSchema,
  AttSchema,
  EventSchema,
  DirectiveSchema,
  DirectiveName,
} from '../types';

const directives = [
  '(if)',
  '(else)',
  '(elseif)',
  '(ref)',
  '(each)',
  '(loop)',
  '(index)',
];

export function parseAttribs(
  schema: RawTagSchema | RawNutSchema
): (AttSchema | EventSchema | DirectiveSchema)[] {
  const { attribs } = schema;
  return Object.keys(attribs).map((att) => {
    const value = attribs[att].trim();
    const attType = getAttType(att);
    if (attType === 'static' || attType === 'dynamic') {
      return parseRegularAttribute(att, value);
    } else if (attType === 'event') {
      return parseEvent(att, value);
    } else return parseDirective(att, value);
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

function parseEvent(att: string, value: string): EventSchema {
  return { kind: 'event', name: att.slice(1), value };
}

function parseDirective(att: string, value: string): DirectiveSchema {
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
