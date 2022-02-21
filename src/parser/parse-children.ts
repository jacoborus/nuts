import {
  TagSchema,
  SubCompSchema,
  RawNutSchema,
  DirectiveSchema,
  FinalSchema,
  TreeSchema,
  NodeTypes,
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
    if (child.kind === 'if') {
      const tree: TreeSchema = {
        type: NodeTypes.TREE,
        kind: 'if',
        requirement: child.requirement,
        yes: child.yes,
        no: [],
        reactive: false,
      };
      flat.push(tree);
      prev = tree;
      return;
    }
    if (child.kind === 'elseif') {
      const tree: TreeSchema = {
        type: NodeTypes.TREE,
        kind: 'elseif',
        requirement: child.requirement,
        yes: child.yes,
        no: [],
        reactive: false,
      };
      const previous: TreeSchema = prev as TreeSchema;
      previous.no = [tree];
      prev = tree;
    }
    if (child.kind === 'else') {
      const previous: TreeSchema = prev as TreeSchema;
      previous.no = child.no;
      prev = null;
    }
  });
  return flat;
}

function isCondition(schema: ElemSchema): schema is TreeSchema {
  return schema.type === NodeTypes.TREE;
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
    type: NodeTypes.COMPONENT,
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

export function parseTag(schema: RawTagSchema): ElemSchema {
  const { name } = schema;
  const { ref, events, attributes, directives } = splitAttribs(schema);
  const tag: TagSchema = {
    type: NodeTypes.TAG,
    name,
    isVoid: voidElements.includes(name),
    ref,
    events,
    attributes,
    children: parseChildren(schema.children),
  };
  return parseAttDirectives(directives, tag);
}
