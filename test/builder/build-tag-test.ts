import test from 'tape';

import { buildTag } from '../../src/builder/build-tag';
import { TagSchema } from '../../src/common';

test('Build#Tag', (t) => {
  const tagSchema = {
    kind: 'tag',
    name: 'div',
    attribs: [
      {
        kind: 'plain',
        propName: 'p1',
        value: 'v1',
        variables: [],
      },
      {
        kind: 'variable',
        propName: 'p2',
        value: 'v2',
        variables: ['v2'],
      },
    ],
    children: [
      {
        kind: 'tag',
        name: 'span',
        attribs: [],
        children: [],
      },
      {
        kind: 'text',
        mode: 'constant',
        literal: 'c1',
      },
    ],
  };
  const result =
    "renderTag('div',[renderAttPlain('p1','v1'),renderAttVariable('p2',box => `v2`,['v2'])],[renderTag('span',[],[]),renderTextConstant(box => `c1`, [])])";
  const str = buildTag(tagSchema as TagSchema);
  t.is(str, result);
  t.end();
});
