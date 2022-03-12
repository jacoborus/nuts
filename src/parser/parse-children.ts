import { ElemSchema } from '../types';
import { Reader } from './reader';
import { parseText } from './parse-text';
import { parseTag } from './parse-tag';
import { parseComment } from './parse';

export function parseChildren(reader: Reader, tagname: string): ElemSchema[] {
  const schema = [] as ElemSchema[];
  while (!reader.isTagClosing(tagname)) {
    if (reader.char() !== '<') {
      schema.push(...parseText(reader));
      continue;
    }
    if (reader.isCommentTag()) {
      const comment = parseComment(reader);
      schema.push(comment);
      continue;
    }
    schema.push(parseTag(reader));
  }
  return schema;
}
