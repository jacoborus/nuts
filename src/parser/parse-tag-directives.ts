import {
  LoopSchema,
  CondSchema,
  TagSchema,
  DirAttSchema,
  DirectiveSchema,
  CompSchema,
} from '../types';

export function parseAttDirectives(
  directives: DirAttSchema[],
  tag: TagSchema | CompSchema | LoopSchema | CondSchema
): DirectiveSchema | TagSchema | CompSchema {
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
        target: dirObj.loop.value,
        index: dirObj?.index?.value,
        pos: dirObj?.pos?.value,
        children: [],
      } as LoopSchema)
    : null;

  const conditionalTag =
    dirObj.dif || dirObj.delse || dirObj.delseif
      ? ({
          kind: 'condition',
          condition: (dirObj?.dif?.name ||
            dirObj?.delseif?.name ||
            dirObj?.delse?.name) as string,
          target: (dirObj?.dif?.value ||
            dirObj?.delseif?.value ||
            dirObj?.delse?.value ||
            '') as string,
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
