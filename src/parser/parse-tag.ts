import {
  RawTagSchema,
  TagSchema,
  DirectiveSchema,
  TextSchema,
  CompSchema,
} from '../types';

import {
  parseAttribs,
  getRegularAttributes,
  getRefAttribute,
  getEventAttributes,
  getDirectiveAttributes,
} from './parse-attribs';
import { parseChildren } from './parse-children';
import { parseAttDirectives } from './parse-directives';

const voidElements = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
];

export function parseTag(
  schema: RawTagSchema
): TagSchema | TextSchema | DirectiveSchema | CompSchema {
  const { name } = schema;
  const attribs = parseAttribs(schema);
  const attributes = getRegularAttributes(attribs);
  const ref = getRefAttribute(attribs);
  const events = getEventAttributes(attribs);
  const directives = getDirectiveAttributes(attribs);
  const tag: TagSchema = {
    kind: 'tag',
    name,
    attributes,
    children: parseChildren(schema.children),
    isVoid: voidElements.includes(name),
    events,
  };
  if (ref) tag.ref = ref.value;
  return parseAttDirectives(directives, tag);
}
