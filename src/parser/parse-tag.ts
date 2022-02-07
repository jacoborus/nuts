import { RawTagSchema, TagSchema, ElemSchema } from '../types';
import { splitAttribs } from './parse-attribs';
import { parseChildren } from './parse-children';
import { parseAttDirectives } from './parse-tag-directives';
import { voidElements } from '../common';

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
