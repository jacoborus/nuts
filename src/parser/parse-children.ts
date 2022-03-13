import {
  ElemSchema,
  NodeTypes,
  LoopSchema,
  TreeSchema,
  TreeKind,
  TagSchema,
  AttSchema,
} from '../types';
import { Reader } from './reader';
import { parseText } from './parse-text';
import { parseTag } from './parse-tag';
import { parseComment } from './parse';
import { parseExpression } from './parse-expression';
import { directiveTags } from '../types';

export function parseChildren(reader: Reader, tagname: string): ElemSchema[] {
  const schema = [] as ElemSchema[];
  while (!reader.isTagClosing(tagname)) {
    if (reader.char() !== '<') {
      schema.push(...parseText(reader));
      continue;
    }
    if (reader.isCommentTag()) {
      const comment = parseComment(reader);
      schema.push(comment);
      continue;
    }
    schema.push(parseTag(reader));
  }
  const stepSchemas = convertDirectiveTags(schema);
  const finalSchemas = convertDirectiveAtts(stepSchemas);
  return finalSchemas;
}

function convertDirectiveTags(schemas: ElemSchema[]): ElemSchema[] {
  return schemas.map((schema) => {
    if (schema.type !== NodeTypes.TAG) return schema;
    if (schema.name === 'loop') return getLoopSchema(schema);
    if (!schema.isDirective) return schema;
    return getTreeSchema(schema);
  });
}

function getLoopSchema(tag: TagSchema): LoopSchema {
  const indexAtt = tag.attributes.find(
    (att) => att.isDirective && att.name === 'index'
  );
  const index = indexAtt ? indexAtt.value : undefined;
  const posAtt = tag.attributes.find(
    (att) => att.isDirective && att.name === 'pos'
  );
  const pos = posAtt ? posAtt.value : undefined;
  const pretarget = tag.attributes
    .find(
      ({ name, value }) =>
        name.startsWith('(') && name.endsWith(')') && value === ''
    )
    ?.name.slice(1, -1);
  const target = pretarget ? parseExpression(pretarget) : [];
  return {
    type: NodeTypes.LOOP,
    target,
    index,
    pos,
    children: tag.children,
    start: tag.start,
    end: tag.end,
  };
}

function getTreeSchema(tag: TagSchema): TreeSchema {
  const pretarget = tag.attributes
    .find(
      ({ name, value }) =>
        name.startsWith('(') && name.endsWith(')') && value === ''
    )
    ?.name.slice(1, -1);
  const requirement = pretarget ? parseExpression(pretarget) : [];
  return {
    type: NodeTypes.TREE,
    kind: tag.name as TreeKind,
    reactive: false,
    requirement,
    yes: tag.children,
    no: [],
    start: tag.start,
    end: tag.end,
  };
}

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
    console.log(JSON.stringify(directives, null, 2));
    if (directives.loop) return tagToLoop(schema);
    return schema;
  });
}

function tagToLoop(tag: TagSchema): LoopSchema {
  const loopAtt = tag.attributes.find(
    (att) => att.name === 'loop' && att.isDirective
  ) as AttSchema;
  const target = loopAtt.value;
  if (!target) throw new Error('Loop tag missing target');
  const pos = tag.attributes.find(
    (att) => att.name === 'pos' && att.isDirective
  )?.value;
  const index = tag.attributes.find(
    (att) => att.name === 'index' && att.isDirective
  )?.value;
  return {
    type: NodeTypes.LOOP,
    target: parseExpression(target),
    index,
    pos,
    source: loopAtt,
    children: [clearTagDirectives(tag)],
    start: loopAtt.start,
    end: loopAtt.end,
  };
}

function clearTagDirectives(tag: TagSchema): TagSchema {
  const attributes = tag.attributes.filter((att) => !att.isDirective);
  return Object.assign({}, tag, { attributes });
}
