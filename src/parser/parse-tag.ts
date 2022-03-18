import {
  CommentSchema,
  LoopSchema,
  NodeTypes,
  ScriptSchema,
  SubCompSchema,
  TagSchema,
  TemplateSchema,
  TreeKind,
  TreeSchema,
  AttSchema,
} from '../types';
import { voidElements } from '../common';
import { parseAttribs } from './parse-attribs';
import { Reader } from './reader';
import { extractLoopAtts, extractTreeRequirement } from './util';
import { parseChildren } from './parse-children';
import { parseTs } from './parse-typescript';

const directiveTags = ['if', 'else', 'elseif', 'loop', 'target'];

interface TagHead {
  name: string;
  attributes: AttSchema[];
  selfClosed: boolean;
}

export function parseTag(reader: Reader): TagSchema {
  const start = reader.getIndex();
  const { name, attributes, selfClosed } = parseTagHead(reader);
  const isVoid = voidElements.includes(name);
  const children = selfClosed ? [] : parseChildren(reader, name);
  reader.advance(name);
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
    isDirective: directiveTags.includes(name),
    start,
    end,
  };
}

export function parseTagHead(reader: Reader): TagHead {
  reader.next();
  const name = reader.toNext(/\s|>|\/>/);
  const attributes = parseAttribs(reader);
  reader.toNext(/>|\/>/);
  const selfClosed = reader.char() === '/';
  reader.advance(selfClosed ? 2 : 1);
  return { name, attributes, selfClosed };
}

export function parseLoop(reader: Reader): LoopSchema {
  const { attributes, children, start, end } = parseTag(reader);
  const { pos, index, target } = extractLoopAtts(attributes);
  return {
    type: NodeTypes.LOOP,
    target,
    pos,
    index,
    children,
    start,
    end,
  };
}

export function parseTree(reader: Reader): TreeSchema {
  const { attributes, children, name, start, end } = parseTag(reader);
  const isYes = ['if', 'elseif'].includes(name);
  const yes = isYes ? children : [];
  const no = !isYes ? children : [];
  const requirement = isYes ? extractTreeRequirement(attributes) : [];
  return {
    type: NodeTypes.TREE,
    kind: name as TreeKind,
    requirement,
    yes,
    no,
    reactive: false,
    start,
    end,
  };
}

export function parseSubcomp(reader: Reader): SubCompSchema {
  const { attributes, children, name, start, end } = parseTag(reader);
  return {
    type: NodeTypes.SUBCOMPONENT,
    name,
    attributes,
    events: [],
    children,
    start,
    end,
  };
}

export function parseComment(reader: Reader): CommentSchema {
  const type = NodeTypes.COMMENT;
  const start = reader.getIndex();
  reader.advance('<!--');
  const value = reader.toNext(/-->/);
  reader.advance('-->');
  const end = reader.getIndex() - 1;
  return { type, value, start, end };
}

export function parseTemplate(reader: Reader): TemplateSchema {
  const { attributes, children, start, end } = parseTag(reader);
  return {
    type: NodeTypes.TEMPLATE,
    attributes,
    schema: children,
    start,
    end,
  };
}

export function parseScript(reader: Reader): ScriptSchema {
  const start = reader.getIndex();
  const { attributes } = parseTagHead(reader);
  const value = reader.toNext(/<\/script/);
  reader.advance(8);
  reader.toNext(/>/);
  const end = reader.getIndex();
  reader.next();
  const ast = parseTs(reader.sourceFile, value);
  return {
    type: NodeTypes.SCRIPT,
    value,
    attributes,
    start,
    ast,
    end,
  };
}
