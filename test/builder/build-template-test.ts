import test from 'tape'
import fs from 'fs'
import path from 'path'

import { buildTemplate } from '../../src/builder/build-template'
import { TemplateSchema } from '../../src/common'

const pretemplate = fs.readFileSync(path.resolve(__dirname, '../../src/builder/pre-template.txt'), 'UTF8')

test('Build template', t => {
  const templateSchema = {
    kind: 'template',
    children: [
      {
        kind: 'tag',
        name: 'div',
        attribs: [
          {
            kind: 'plain',
            propName: 'p1',
            value: 'p2',
            variables: []
          },
          {
            kind: 'variable',
            propName: 'v1',
            value: 'v2',
            variables: ['v2']
          }
        ],
        children: [
          {
            kind: 'tag',
            name: 'span',
            attribs: [],
            children: []
          }
        ]
      },
      {
        kind: 'text',
        mode: 'constant',
        literal: 'c1',
        variables: []
      }
    ]
  }
  const result = "renderTemplate([renderTag('div',[renderAttPlain('p1','p2'),renderAttVariable('v1',box => `v2`, ['v2'])],[renderTag('span',[],[])]),renderTextConstant(box => `c1`, [])])"
  const str = buildTemplate(templateSchema as TemplateSchema)
  t.is(str, pretemplate + 'export const render = ' + result)
  t.end()
})
