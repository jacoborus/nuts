import { buildAttribs } from './build-attribs';
import { buildChildren } from './build-children';

import { TagSchema } from '../common';

export function buildTag(schema: TagSchema): string {
  const { name, attribs, children } = schema;
  const atts = buildAttribs(attribs);
  const childTags = buildChildren(children).join(',');
  return `renderTag('${name}',[${atts}],[${childTags}])`;
}
