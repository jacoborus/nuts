import {
  TagSchema,
  SubCompSchema,
  RawNutSchema,
  DirectiveSchema,
  FinalSchema,
  CondSchema,
  TreeSchema,
} from '../types';

import { parseText } from './parse-text';
import { splitAttribs } from './parse-attribs';
import { parseAttDirectives } from './parse-tag-directives';
import { parseDirective } from './parse-directive';
import { tagnames, voidElements } from '../common';

import { RawSchema, RawTagSchema, RawTextSchema, ElemSchema } from '../types';

export function parseChildren(children: RawSchema[]): FinalSchema[] {
  const parsed: ElemSchema[] = [];
  children.forEach((schema: RawSchema) => {
    if (isTextNode(schema)) return parsed.push(...parseText(schema));
    if (isTagNode(schema)) return parsed.push(parseTag(schema));
    if (isDirectiveNode(schema)) return parsed.push(parseDirective(schema));
    parsed.push(parseSubcomp(schema));
  });
  return groupConditionals(parsed);
}

// TODO: test  and improve this method (it needs error handling)
function groupConditionals(children: ElemSchema[]): FinalSchema[] {
  const flat: FinalSchema[] = [];
  let prev: TreeSchema | null = null;
  children.forEach((child) => {
    if (!isCondition(child)) {
      flat.push(child);
      prev = null;
      return;
    }
    if (child.condition === 'if') {
      const tree: TreeSchema = {
        type: 'tree',
        requirement: child.target,
        yes: child.children as FinalSchema[],
        no: [],
      };
      flat.push(tree);
      prev = tree;
      return;
    }
    if (child.condition === 'elseif') {
      const tree: TreeSchema = {
        type: 'tree',
        requirement: child.target,
        yes: child.children as FinalSchema[],
        no: [],
      };
      const previous: TreeSchema = prev as TreeSchema;
      previous.no = [tree];
      prev = tree;
    }
    if (child.condition === 'else') {
      const previous: TreeSchema = prev as TreeSchema;
      previous.no = child.children as unknown as TreeSchema[];
      prev = null;
    }
  });
  return flat;
}

function isCondition(schema: ElemSchema): schema is CondSchema {
  return schema.type === 'condition';
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

export function parseSubcomp(
  schema: RawNutSchema
): DirectiveSchema | SubCompSchema {
  const { name } = schema;
  const { ref, events, attributes, directives } = splitAttribs(schema);
  const comp: SubCompSchema = {
    type: 'component',
    name,
    ref,
    events,
    attributes,
    children: parseChildren(schema.children),
  };
  return parseAttDirectives(directives, comp) as
    | SubCompSchema
    | DirectiveSchema;
}

export function parseTag(schema: RawTagSchema): FinalSchema {
  const { name } = schema;
  const { ref, events, attributes, directives } = splitAttribs(schema);
  const tag: TagSchema = {
    type: 'tag',
    name,
    isVoid: voidElements.includes(name),
    ref,
    events,
    attributes,
    children: parseChildren(schema.children),
  };
  return parseAttDirectives(directives, tag);
}
