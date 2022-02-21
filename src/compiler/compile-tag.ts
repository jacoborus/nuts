import { TagSchema, TextSchema, FinalSchema } from '../types';
import { compileAttribs } from './compile-attribs';
import { compileText } from './compile-text';
import { compileDirective } from './compile-directive';
import { tagnames } from '../common';

const start = '<';
const end = '>';
const voidEnd = '/>';

export function compileChildren(schemas: FinalSchema[]): string {
  return schemas
    .map((schema: FinalSchema) => {
      if (isTextNode(schema)) return compileText(schema);
      if (isTagNode(schema)) return compileTag(schema);
      if (isDirectiveNode(schema)) return compileDirective(schema);
      // return compileSubComp(schema);
    })
    .join('');
}

function isTextNode(schema: FinalSchema): schema is TextSchema {
  return schema.type === 'text';
}

function isTagNode(schema: FinalSchema): schema is TagSchema {
  return schema.type === 'tag' && tagnames.includes(schema.name);
}

function isDirectiveNode(schema: FinalSchema): schema is TagSchema {
  return schema.type === 'tree' || schema.type === 'loop';
}

export function compileTag(schema: TagSchema): string {
  const attribs = compileAttribs(schema.attributes);
  const firstEnd = schema.isVoid ? voidEnd : end;
  const children = compileChildren(schema.children as FinalSchema[]);
  const secondEnd = schema.isVoid ? '' : `</${schema.name}>`;
  return start + schema.name + attribs + firstEnd + children + secondEnd;
}