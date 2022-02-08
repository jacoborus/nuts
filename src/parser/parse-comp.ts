import { SubCompSchema, RawNutSchema, DirectiveSchema } from '../types';
import { splitAttribs } from './parse-attribs';
import { parseAttDirectives } from './parse-tag-directives';
import { parseChildren } from './parse-children';

export function parseComp(schema: RawNutSchema): DirectiveSchema | SubCompSchema {
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
  return parseAttDirectives(directives, comp) as SubCompSchema | DirectiveSchema;
}

