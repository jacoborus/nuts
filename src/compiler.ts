import {
  IAttr,
  IAttrDyn,
  ComponentSchema,
  ElemSchema,
  Expression,
  ExpressionChunk,
  NodeType,
  ITag,
  LoopSchema,
  TreeSchema,
  IText,
} from './types';
import { tagnames } from './common';

export function compileText(chunk: IText): string {
  if (!chunk.dynamic) return chunk.value;
  const expr = compileExpression(chunk.expr as Expression);
  return '${' + expr + '}';
}

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

function isTextNode(schema: ElemSchema): schema is IText {
  return schema.type === NodeType.Text;
}

function isTagNode(schema: ElemSchema): schema is ITag {
  return schema.type === NodeType.Tag && tagnames.includes(schema.name);
}

function isDirectiveNode(schema: ElemSchema): schema is ITag {
  return schema.type === NodeType.Tree || schema.type === NodeType.Loop;
}

export function compileTag(schema: ITag): string {
  const attribs = compileAttribs(schema.attributes);
  const firstEnd = schema.isVoid ? voidEnd : end;
  const children = compileChildren(schema.body as ElemSchema[]);
  const secondEnd = schema.isVoid ? '' : `</${schema.name}>`;
  return start + schema.name + attribs + firstEnd + children + secondEnd;
}

export function compileAttribs(atts: (IAttr | IAttrDyn)[]): string {
  return atts
    .map((att) => {
      if (!att.dynamic) {
        return att.isBoolean
          ? compileBooleanStaticAtt(att)
          : compileStaticAtt(att);
      }
      return att.isBoolean
        ? compileBooleanDynamicAtt(att)
        : compileDynamicAtt(att);
    })
    .join('');
}

function compileStaticAtt(att: IAttr): string {
  return ' ' + att.name + '="' + att.value + '"';
}

function compileBooleanStaticAtt(att: IAttr): string {
  return ' ' + att.name;
}

function compileDynamicAtt(att: IAttrDyn): string {
  const expr = compileExpression(att.expr as Expression);
  return ' ' + att.name + '="${' + expr + ' ?? ""}"';
}

function compileBooleanDynamicAtt(att: IAttrDyn): string {
  const expr = compileExpression(att.expr as Expression);
  return '${' + expr + ' ? " ' + att.name + '" : "" }';
}

export function compileComponent(compSchema: ComponentSchema) {
  const children = compileChildren(compSchema.template?.schema as ElemSchema[]);
  return 'export default function (it) {return `' + children + '`}';
}

export function compileDirective(directive: LoopSchema | TreeSchema): string {
  if (directive.type === NodeType.Loop) return compileLoop(directive);
  return compileTree(directive);
}

export function compileLoop(directive: LoopSchema): string {
  const children = compileChildren(directive.body);
  const expr = compileExpression(directive.loop);
  return (
    '${(' +
    expr +
    ' || []).map(item => {const parent = [it], it = item;return `' +
    children +
    '`}).join("")}'
  );
}

export function compileTree(directive: TreeSchema): string {
  const yes = compileChildren(directive.yes);
  const no = compileChildren(directive.no);
  const expr = compileExpression(directive.condition);
  return '${' + expr + ' ? `' + yes + '` : `' + no + '`}';
}

// espressions will render inside functions which params are:
// - it:
//   - current scope
//   - expression without prefix: `uno.dos.tres`
// - scopes:
//   - [parentScope, parentOfParentScope, ...]
//   - expression with `../` prefix: `../uno.dos`
//   - subexpression with `../` interlaced: `uno.[../other].tres`
// - helpers:
//   - prefixed with `@`
// - globals:
//   - prefixed with `$`
//   - example: `$route.params.id`

export function compileExpression(expr: Expression): string {
  const first = expr.shift() as ExpressionChunk;
  let str = !first.scope ? 'it' : `parent[${first.scope - 1}]?`;
  str = str + `.${print(first.value)}`;
  expr.forEach((chunk) => {
    if (!chunk.scope) {
      str = str + `?.${print(chunk.value)}`;
    } else {
      str = str + `?.[parent[${chunk.scope - 1}]?.${print(chunk.value)}]`;
    }
  });
  return str;
}

function print(str: string): string {
  return Number.isNaN(Number(str)) ? str : `["${str}"]`;
}
