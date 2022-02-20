import {
  LoopSchema,
  TreeSchema,
  TagSchema,
  DirAttSchema,
  DirectiveSchema,
  SubCompSchema,
  TreeKind,
} from '../types';
import { parseExpression } from './parse-expression';

export function parseAttDirectives(
  directives: DirAttSchema[],
  tag: TagSchema | SubCompSchema | LoopSchema | TreeSchema
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
        type: 'loop',
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
          type: 'tree',
          kind: (dirObj?.dif?.name ||
            dirObj?.delseif?.name ||
            dirObj?.delse?.name) as TreeKind,
          requirement: parseExpression(
            dirObj?.dif?.value ||
              dirObj?.delseif?.value ||
              dirObj?.delse?.value ||
              ''
          ),
          reactive: false,
          yes: [],
          no: [],
        } as TreeSchema)
      : null;

  if (iterateTag) {
    iterateTag.children = [tag as TagSchema];
  }

  if (conditionalTag) {
    const children = iterateTag ? [iterateTag] : ([tag] as TagSchema[]);
    if (conditionalTag.kind === 'else') {
      conditionalTag.no = children;
      conditionalTag.yes = [];
    } else {
      conditionalTag.yes = children;
      conditionalTag.no = [];
    }
    return conditionalTag;
  }
  return iterateTag ? iterateTag : tag;
}
