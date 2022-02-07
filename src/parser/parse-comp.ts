import { CompSchema, RawNutSchema, DirectiveSchema } from '../types';
import { splitAttribs } from './parse-attribs';
import { parseAttDirectives } from './parse-tag-directives';
import { parseChildren } from './parse-children';

export function parseComp(schema: RawNutSchema): DirectiveSchema | CompSchema {
  const { name } = schema;
  const { ref, events, attributes, directives } = splitAttribs(schema);
  const comp: CompSchema = {
    kind: 'component',
    name,
    ref,
    events,
    attributes,
    children: parseChildren(schema.children),
  };
  return parseAttDirectives(directives, comp) as CompSchema | DirectiveSchema;
}
