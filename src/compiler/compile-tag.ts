import { TagSchema } from '../types';
import { compileAttribs } from './compile-attribs';

const start = '<';
const end = '>';
const voidEnd = '/>';

export function compileTag(schema: TagSchema): string {
  const attribs = compileAttribs(schema.attributes);
  const firstEnd = schema.isVoid ? voidEnd : end;
  const secondEnd = schema.isVoid ? '' : `</${schema.name}>`;
  return start + schema.name + attribs + firstEnd + secondEnd;
}
