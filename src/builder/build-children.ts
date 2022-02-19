import { buildText } from './build-text';
import { buildNut } from './build-nut';
import { buildConditional } from './build-conditional';
import { buildTag } from './build-tag';

import { ElemSchema, NutType, ElemBuilder } from '../common';

type Builders = { [K in NutType]: ElemBuilder };
const builders: Builders = {
  tag: buildTag as ElemBuilder,
  text: buildText as ElemBuilder,
  nut: buildNut as ElemBuilder,
  conditionalConst: buildConditional as ElemBuilder,
  conditionalVar: buildConditional as ElemBuilder,
};

export function buildChildren(children: ElemSchema[]): string[] {
  // next line avoids circular dependency side effect
  builders.tag = buildTag as ElemBuilder;
  const childTags = children.map((child) => {
    const build = builders[child.type];
    return build(child);
  });
  return childTags;
}
