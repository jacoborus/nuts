import {
  CommentSchema,
  LoopSchema,
  NodeTypes,
  ScriptSchema,
  SubCompSchema,
  TagSchema,
  TemplateSchema,
  TreeSchema,
  AttSchema,
} from '../types';
import { voidElements } from '../common';
import { parseAttribs } from './parse-attribs';
import { Reader } from './reader';
import { extractLoopAtts } from './util';
import { parseChildren } from './parse-children';
import { parseExpression } from '../../lib/parser/parse-expression';

const directiveTags = ['if', 'else', 'elseif', 'loop'];

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
  const start = reader.getIndex();
  const { name, attributes, selfClosed } = parseTagHead(reader);
  const { pos, index, target } = extractLoopAtts(attributes);
  const children = selfClosed ? [] : parseChildren(reader, name);
  reader.toNext(/>/);
  const end = reader.getIndex();
  reader.next();
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
  // TODO: parseDirective
  // TODO: parseDirective
}

export function parseSubcomp(reader: Reader): SubCompSchema {
  const start = reader.getIndex();
  reader.next();
  const name = reader.toNext(/\s|>|\/>/);
  const selfClosed = ['>', '/'].includes(reader.char());
  const attributes = selfClosed ? [] : parseAttribs(reader);
  if (reader.char() === '>') reader.next();
  if (reader.char() === '/') reader.next(2);
  const children = selfClosed ? [] : parseChildren(reader, name);
  reader.advance(name);
  reader.toNext(/>/);
  const end = reader.getIndex();
  reader.next();
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
  const start = reader.getIndex();
  reader.advance('<!--');
  const value = reader.toNext(/-->/);
  reader.advance(2);
  const type = NodeTypes.COMMENT;
  const end = reader.getIndex();
  reader.next();
  return { type, value, start, end };
}

export function parseScript(reader: Reader): ScriptSchema {
  const start = reader.getIndex();
  const { attributes } = parseTagHead(reader);
  const value = reader.toNext(/<\/script/);
  reader.advance(8);
  reader.toNext(/>/);
  const end = reader.getIndex();
  reader.next();
  return {
    type: NodeTypes.SCRIPT,
    value,
    attributes,
    start,
    end,
  };
}

export function parseTemplate(reader: Reader): TemplateSchema {
  const start = reader.getIndex();
  reader.advance('<template ');
  const attributes = parseAttribs(reader);
  reader.toNext(/>/);
  const schema = parseChildren(reader, 'template');
  const end = reader.getIndex();
  return {
    type: NodeTypes.TEMPLATE,
    attributes,
    schema,
    start,
    end,
  };
}
