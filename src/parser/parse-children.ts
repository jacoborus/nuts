import {
  TagSchema,
  SubCompSchema,
  RawNutSchema,
  DirectiveSchema,
} from '../types';

import { parseText } from './parse-text';
import { splitAttribs } from './parse-attribs';
import { parseAttDirectives } from './parse-tag-directives';
import { parseDirective } from './parse-directive';
import { tagnames, voidElements } from '../common';

import { RawSchema, RawTagSchema, RawTextSchema, ElemSchema } from '../types';

export function parseChildren(children: RawSchema[]): ElemSchema[] {
  const parsed: ElemSchema[] = [];
  children.forEach((schema: RawSchema) => {
    if (isTextNode(schema)) return parsed.push(...parseText(schema));
    if (isTagNode(schema)) return parsed.push(parseTag(schema));
    if (isDirectiveNode(schema)) return parsed.push(parseDirective(schema));
    parsed.push(parseSubcomp(schema));
  });
  return parsed;
}

// function groupConditionals(children: ElemSchema[]): ElemSchema[] {
//   const flat: ElemSchema[] = [];
//   children.forEach((child) => {
//     if (child.type === 'Cond') flat.push(child);
//   });
//   return flat;
// }

function isTextNode(schema: RawSchema): schema is RawTextSchema {
  return schema.type === 'text';
}

function isTagNode(schema: RawSchema): schema is RawTagSchema {
  return schema.type === 'tag' && tagnames.includes(schema.name);
}

const directiveNames = ['if', 'else', 'elseif', 'loop'];
function isDirectiveNode(schema: RawSchema): schema is RawTagSchema {
  return schema.type === 'tag' && directiveNames.includes(schema.name);
}

export function parseSubcomp(
  schema: RawNutSchema
): DirectiveSchema | SubCompSchema {
  const { name } = schema;
  const { ref, events, attributes, directives } = splitAttribs(schema);
  const comp: SubCompSchema = {
    type: 'component',
    name,
    ref,
    events,
    attributes,
    children: parseChildren(schema.children),
  };
  return parseAttDirectives(directives, comp) as
    | SubCompSchema
    | DirectiveSchema;
}

export function parseTag(schema: RawTagSchema): ElemSchema {
  const { name } = schema;
  const { ref, events, attributes, directives } = splitAttribs(schema);
  const tag: TagSchema = {
    type: 'tag',
    name,
    isVoid: voidElements.includes(name),
    ref,
    events,
    attributes,
    children: parseChildren(schema.children),
  };
  return parseAttDirectives(directives, tag);
}
