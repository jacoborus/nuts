import {
  CompSchema,
  RawNutSchema,
  EventSchema,
  AttSchema,
  DirAttSchema,
  DirectiveSchema,
} from '../types';

import {
  parseAttribs,
  getRegularAttributes,
  getRefAttribute,
  getEventAttributes,
  getDirectiveAttributes,
} from './parse-attribs';
import { parseAttDirectives } from './parse-directives';
import { parseChildren } from './parse-children';

export function parseComp(schema: RawNutSchema): DirectiveSchema | CompSchema {
  const { name } = schema;
  const attribs = parseAttribs(schema);
  const attributes = getRegularAttributes(attribs);
  const ref = getRefAttribute(attribs);
  const events = getEventAttributes(attribs);
  const directives = getDirectiveAttributes(attribs);
  const comp = {
    kind: 'component',
    name,
    ref,
    events,
    attributes,
    children: parseChildren(schema.children),
  };
  return parseAttDirectives(directives, comp);
}
