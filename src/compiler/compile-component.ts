import { ComponentSchema, ElemSchema } from '../types';
import { compileChildren } from './compile-tag';

export function compileComponent(compSchema: ComponentSchema) {
  const children = compileChildren(compSchema.template?.schema as ElemSchema[]);
  return 'export default function (it) {return `' + children + '`}';
}
