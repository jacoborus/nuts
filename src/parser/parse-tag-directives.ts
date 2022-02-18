import {
  LoopSchema,
  CondSchema,
  TagSchema,
  DirAttSchema,
  DirectiveSchema,
  SubCompSchema,
} from '../types';
import { parseExpression } from './parse-expression';

export function parseAttDirectives(
  directives: DirAttSchema[],
  tag: TagSchema | SubCompSchema | LoopSchema | CondSchema
): DirectiveSchema | TagSchema | SubCompSchema {
  const dirObj = {
    loop: directives.find((dir) => dir.name === 'loop'),
    index: directives.find((dir) => dir.name === 'index'),
    pos: directives.find((dir) => dir.name === 'pos'),
    dif: directives.find((dir) => dir.name === 'if'),
    delseif: directives.find((dir) => dir.name === 'elseif'),
    delse: directives.find((dir) => dir.name === 'else'),
  };

  const iterateTag = dirObj.loop
    ? ({
        kind: 'loop',
        target: parseExpression(dirObj.loop.value),
        index: dirObj?.index?.value,
        pos: dirObj?.pos?.value,
        children: [],
      } as LoopSchema)
    : null;

  const conditionalTag =
    dirObj.dif || dirObj.delse || dirObj.delseif
      ? ({
          // TODO: Fix this unsafe mess
          kind: 'condition',
          condition: (dirObj?.dif?.name ||
            dirObj?.delseif?.name ||
            dirObj?.delse?.name) as string,
          target: parseExpression(
            dirObj?.dif?.value ||
              dirObj?.delseif?.value ||
              dirObj?.delse?.value ||
              ''
          ),
          reactive: false,
          children: [],
        } as CondSchema)
      : null;

  if (iterateTag) {
    iterateTag.children = [tag];
  }

  if (conditionalTag) {
    conditionalTag.children = iterateTag ? [iterateTag] : [tag];
    return conditionalTag;
  }
  return iterateTag ? iterateTag : tag;
}
