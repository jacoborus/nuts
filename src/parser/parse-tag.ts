import {
  CommentSchema,
  LoopSchema,
  NodeTypes,
  ScriptSchema,
  SubCompSchema,
  TagSchema,
  TemplateSchema,
  TreeSchema,
} from '../types';
import { voidElements } from '../common';
import { parseAttribs } from './parse-attribs';
import { Reader } from './reader';
import { parseChildren } from './parse-children';

const directiveTags = ['if', 'else', 'elseif', 'loop'];

export function parseTag(reader: Reader): TagSchema {
  const start = reader.getIndex();
  reader.next();
  const name = reader.toNext(/\s|>/);
  const attributes = reader.char() === '>' ? [] : parseAttribs(reader);
  if (reader.char() === '>') reader.next();
  const isVoid = voidElements.includes(name);
  const children = isVoid ? [] : parseChildren(reader, name);
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

export function parseLoop(reader: Reader): LoopSchema {
  // TODO: parseDirective
  // TODO: parseDirective
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
  reader.advance('<script ');
  const attributes = parseAttribs(reader);
  const bodyEnd = reader.findNext(/<\/script/);
  const body = reader.slice(0, bodyEnd);
  reader.advance(bodyEnd + 8);
  reader.toNext(/>/);
  const end = reader.getIndex();
  return {
    type: NodeTypes.SCRIPT,
    value: body,
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
