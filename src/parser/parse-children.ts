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
  return children.map((schema: RawSchema) => {
    if (isTextNode(schema)) return parseText(schema);
    if (isTagNode(schema)) return parseTag(schema);
    if (isDirectiveNode(schema)) return parseDirective(schema);
    return parseSubcomp(schema);
  }) as ElemSchema[];
}

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
    kind: 'component',
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
    kind: 'tag',
    name,
    isVoid: voidElements.includes(name),
    ref,
    events,
    attributes,
    children: parseChildren(schema.children),
  };
  return parseAttDirectives(directives, tag);
}
