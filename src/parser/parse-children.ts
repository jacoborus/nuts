import {
  ElemSchema,
  NodeTypes,
  LoopSchema,
  TreeSchema,
  TreeKind,
  TagSchema,
  AttSchema,
  directiveTags,
} from '../types';
import { Reader } from './reader';
import { parseText } from './parse-text';
import {
  parseTag,
  parseComment,
  parseSubcomp,
  parseLoop,
  parseTree,
} from './parse-tag';
import {
  clearAttDirectives,
  extractLoopAtts,
  extractTreeRequirement,
} from './util';

export function parseChildren(reader: Reader, tagname: string): ElemSchema[] {
  const schema = [] as ElemSchema[];
  while (!reader.isTagClosing(tagname)) {
    if (reader.char() !== '<') {
      schema.push(...parseText(reader));
      continue;
    }
    if (reader.isCommentTag()) {
      schema.push(parseComment(reader));
      continue;
    }
    if (reader.isLoop()) {
      schema.push(parseLoop(reader));
      continue;
    }
    if (reader.isTree()) {
      schema.push(parseTree(reader));
      continue;
    }
    if (reader.isCustomComp()) {
      schema.push(parseSubcomp(reader));
      continue;
    }
    schema.push(parseTag(reader));
  }
  const finalSchemas = convertDirectiveAtts(schema, reader);
  return finalSchemas;
}

function convertDirectiveAtts(
  schemas: ElemSchema[],
  reader: Reader
): ElemSchema[] {
  return schemas.map((schema) => {
    if (schema.type !== NodeTypes.TAG) return schema;
    const attDirectives = schema.attributes.filter(
      ({ name, isDirective }) =>
        isDirective && directiveTags.includes(name.value)
    );
    if (!attDirectives.length) return schema;
    const directives = Object.fromEntries(
      schema.attributes
        .filter(({ isDirective }) => isDirective)
        .map((att) => [att.name.value, att])
    );
    const isTree = !!(directives.if || directives.elseif || directives.else);
    const isLoop = !!directives.loop;
    if (isLoop && isTree) return tagToLoopTree(schema, reader);
    if (isLoop) return tagToLoop(schema, reader);
    if (isTree) {
      return tagToTree(schema, reader);
    }
    return schema;
  });
}

function tagToLoop(tag: TagSchema, reader: Reader): LoopSchema {
  const loopAtt = tag.attributes.find(
    (att) => att.name.value === 'loop' && att.isDirective
  ) as AttSchema;
  const { pos, index, target } = extractLoopAtts(tag.attributes, reader);
  return {
    type: NodeTypes.LOOP,
    target,
    index,
    pos,
    source: loopAtt,
    children: [clearAttDirectives(tag)],
    start: loopAtt.start,
    end: loopAtt.end,
  };
}

function tagToLoopTree(tag: TagSchema, reader: Reader): LoopSchema {
  const loopAtt = tag.attributes.find(
    (att) => att.name.value === 'loop' && att.isDirective
  ) as AttSchema;
  const { pos, index, target } = extractLoopAtts(tag.attributes, reader);
  return {
    type: NodeTypes.LOOP,
    target,
    index,
    pos,
    source: loopAtt,
    children: [tagToTree(tag, reader)],
    start: loopAtt.start,
    end: loopAtt.end,
  };
}

function tagToTree(tag: TagSchema, reader: Reader): TreeSchema {
  const requirement = extractTreeRequirement(tag.attributes, reader);
  if (!requirement) throw new Error('missing loop requirement');
  const { start, end, name } = tag.attributes.find(
    (att) =>
      att.isDirective && ['if', 'else', 'elseif'].includes(att.name.value)
  ) as AttSchema;
  const children = [clearAttDirectives(tag)];
  const isYes = ['if', 'elseif'].includes(name.value);
  const yes = isYes ? children : [];
  const no = isYes ? [] : children;
  return {
    type: NodeTypes.TREE,
    kind: name.value as TreeKind,
    reactive: false,
    requirement,
    yes,
    no,
    start,
    end,
  };
}
