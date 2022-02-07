import { parseText } from './parse-text';
import { parseComp } from './parse-comp';
import { parseTag } from './parse-tag';
import { tagnames } from '../common';

import { RawSchema, RawTagSchema, RawTextSchema, ElemSchema } from '../types';

export function parseChildren(children: RawSchema[]): ElemSchema[] {
  return children.map((schema: RawSchema) => {
    if (isTextNode(schema)) return parseText(schema);
    if (isTagNode(schema)) return parseTag(schema);
    if (isDirectiveNode(schema)) return parseDirective(schema);
    return parseComp(schema);
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
