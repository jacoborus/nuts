import test from 'tape';
import fs from 'fs';
import path from 'path';

import { buildTemplate } from '../../src/builder/build-template';
import { TagSchema } from '../../src/common';

const pretemplate = fs.readFileSync(
  path.resolve(__dirname, '../../src/builder/pre-template.txt'),
  'UTF8'
);

test('Build template', (t) => {
  const templateSchema = {
    kind: 'tag',
    name: 'div',
    attribs: [
      {
        kind: 'plain',
        propName: 'p1',
        value: 'p2',
        variables: [],
      },
      {
        kind: 'variable',
        propName: 'v1',
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
    ],
  };
  const result =
    "renderTemplate(renderTag('div',[renderAttPlain('p1','p2'),renderAttVariable('v1',box => `v2`,['v2'])],[renderTag('span',[],[])]))";
  const str = buildTemplate(templateSchema as TagSchema);
  t.is(str, pretemplate + 'export const { render, createNut } = ' + result);
  t.end();
});
