import { voidElements } from '../common';
import { parseAttribs } from './parse-attribs';
import { Reader } from './reader';
import { TagSchema, NodeTypes } from '../types';
import { parseChildren } from './parse-children';

export function parseTag(reader: Reader): TagSchema {
  const start = reader.getIndex();
  reader.next();
  const name = reader.toNext(/\s/);
  const attributes = parseAttribs(reader);
  const isVoid = voidElements.includes(name);
  const children = isVoid ? [] : parseChildren(reader, name);
  reader.advance(name.length + 2);
  reader.toNext(/>/);
  const end = reader.getIndex();
  reader.next();
  return {
    type: NodeTypes.TAG,
    name,
    isVoid,
    attributes,
    events: [],
    children,
    start,
    end,
  };
}
