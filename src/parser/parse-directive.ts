import {
  SubCompSchema,
  RawNutSchema,
  DirectiveSchema,
  LoopSchema,
  TreeSchema,
  TreeKind,
} from '../types';
import { splitAttribs } from './parse-attribs';
import { parseAttDirectives } from './parse-tag-directives';
import { parseChildren } from './parse-children';
import { parseExpression } from './parse-expression';

export function parseDirective(
  schema: RawNutSchema
): DirectiveSchema | SubCompSchema {
  const { name } = schema;
  if (name === 'loop') return parseLoop(schema);
  else return parseConditional(schema);
}

function parseLoop(schema: RawNutSchema): LoopSchema {
  const { attributes, directives } = splitAttribs(schema);
  const preTarget = attributes.find((att) => isBetweenParens(att.name))?.name;
  const expr = preTarget?.slice(1, -1) || '';
  const target = parseExpression(expr);
  const loop: LoopSchema = {
    type: 'loop',
    target,
    index: directives.find((dir) => dir.name === 'index')?.value || '',
    pos: directives.find((dir) => dir.name === 'pos')?.value || '',
    children: parseChildren(schema.children),
  };
  return parseAttDirectives(directives, loop) as LoopSchema;
}

function parseConditional(schema: RawNutSchema): TreeSchema {
  const { attributes, directives } = splitAttribs(schema);
  const preTarget = attributes.find((att) => isBetweenParens(att.name))?.name;
  const expr = preTarget?.slice(1, -1) || '';
  const requirement = parseExpression(expr);
  const cond: TreeSchema = {
    type: 'tree',
    kind: schema.name as TreeKind,
    requirement,
    reactive: false,
    yes: schema.name !== 'else' ? parseChildren(schema.children) : [],
    no: schema.name === 'else' ? parseChildren(schema.children) : [],
  };
  return parseAttDirectives(directives, cond) as TreeSchema;
}

function isBetweenParens(word: string): boolean {
  return word.startsWith('(') && word.endsWith(')');
}
