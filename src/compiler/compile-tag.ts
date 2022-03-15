import { TagSchema, TextSchema, ElemSchema, NodeTypes } from '../types';
import { compileAttribs } from './compile-attribs';
import { compileText } from './compile-text';
import { compileDirective } from './compile-directive';
import { tagnames } from '../common';

const start = '<';
const end = '>';
const voidEnd = '/>';

export function compileChildren(schemas: ElemSchema[]): string {
  return schemas
    .map((schema: ElemSchema) => {
      if (isTextNode(schema)) return compileText(schema);
      if (isTagNode(schema)) return compileTag(schema);
      if (isDirectiveNode(schema)) return compileDirective(schema);
      // return compileSubComp(schema);
    })
    .join('');
}

function isTextNode(schema: ElemSchema): schema is TextSchema {
  return schema.type === NodeTypes.TEXT;
}

function isTagNode(schema: ElemSchema): schema is TagSchema {
  return schema.type === NodeTypes.TAG && tagnames.includes(schema.name);
}

function isDirectiveNode(schema: ElemSchema): schema is TagSchema {
  return schema.type === NodeTypes.TREE || schema.type === NodeTypes.LOOP;
}

export function compileTag(schema: TagSchema): string {
  const attribs = compileAttribs(schema.attributes);
  const firstEnd = schema.isVoid ? voidEnd : end;
  const children = compileChildren(schema.children as ElemSchema[]);
  const secondEnd = schema.isVoid ? '' : `</${schema.name}>`;
  return start + schema.name + attribs + firstEnd + children + secondEnd;
}
