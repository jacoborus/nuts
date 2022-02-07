import {
  CompSchema,
  RawNutSchema,
  DirectiveSchema,
  LoopSchema,
} from '../types';
import { splitAttribs } from './parse-attribs';
import { parseAttDirectives } from './parse-tag-directives';
import { parseChildren } from './parse-children';

export function parseComp(schema: RawNutSchema): DirectiveSchema | CompSchema {
  const { name } = schema;
  if (name === 'loop') return parseLoop(schema);
  else return parseConditional(schema);
}

function parseLoop(schema: RawNutSchema): LoopSchema {
  const { attributes, directives } = splitAttribs(schema);
  const preTarget = attributes.find((att) => isBetweenParens(att.name))?.name;
  const target = preTarget?.slice(1, -1) || '';
  const loop: LoopSchema = {
    kind: 'loop',
    target,
    index: directives.find((dir) => dir.name === 'index')?.value || '',
    pos: directives.find((dir) => dir.name === 'pos')?.value || '',
    children: parseChildren(schema.children),
  };
  return parseAttDirectives(directives, loop) as LoopSchema;
}

function isBetweenParens(word: string): boolean {
  return word.startsWith('(') && word.endsWith(')');
}
