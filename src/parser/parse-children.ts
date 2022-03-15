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
import { extractLoopAtts, extractTreeRequirement } from './util';

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
  const finalSchemas = convertDirectiveAtts(schema);
  return finalSchemas;
}

// TODO: convert tags with both loop and tree as attributes
// TODO: convert tags with both loop and tree as attributes

function convertDirectiveAtts(schemas: ElemSchema[]): ElemSchema[] {
  return schemas.map((schema) => {
    if (schema.type !== NodeTypes.TAG) return schema;
    const attDirectives = schema.attributes.filter(
      ({ name, isDirective }) => isDirective && directiveTags.includes(name)
    );
    if (!attDirectives.length) return schema;
    const directives = Object.fromEntries(
      schema.attributes
        .filter(({ isDirective }) => isDirective)
        .map((att) => [att.name, att])
    );
    if (directives.loop) return tagToLoop(schema);
    if (directives.if || directives.elseif || directives.else) {
      return tagToTree(schema);
    }
    return schema;
  });
}

function tagToLoop(tag: TagSchema): LoopSchema {
  const loopAtt = tag.attributes.find(
    (att) => att.name === 'loop' && att.isDirective
  ) as AttSchema;
  const { pos, index, target } = extractLoopAtts(tag.attributes);
  return {
    type: NodeTypes.LOOP,
    target,
    index,
    pos,
    source: loopAtt,
    children: [clearTagDirectives(tag)],
    start: loopAtt.start,
    end: loopAtt.end,
  };
}

function tagToTree(tag: TagSchema): TreeSchema {
  const requirement = extractTreeRequirement(tag.attributes);
  const { start, end, name } = tag.attributes.find(
    (att) => att.isDirective && ['if', 'else', 'elseif'].includes(att.name)
  ) as AttSchema;
  const children = [clearTagDirectives(tag)];
  const isYes = ['if', 'elseif'].includes(name);
  const yes = isYes ? children : [];
  const no = isYes ? [] : children;
  return {
    type: NodeTypes.TREE,
    kind: name as TreeKind,
    reactive: false,
    requirement,
    yes,
    no,
    start,
    end,
  };
}

function clearTagDirectives(tag: TagSchema): TagSchema {
  const attributes = tag.attributes.filter((att) => !att.isDirective);
  return Object.assign({}, tag, { attributes });
}
