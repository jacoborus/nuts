import test from 'tape'
import fs from 'fs'
import path from 'path'

import { buildTemplate } from '../../src/builder/build-template'
import { TagSchema } from '../../src/common'

const pretemplate = fs.readFileSync(path.resolve(__dirname, '../../src/builder/pre-template.txt'), 'UTF8')

test('Build template', t => {
  const templateSchema = [
    'tag',
    'template',
    [],
    [
      [
        'tag',
        'div',
        [
          ['plain', 'p1', 'p2'],
          ['variable', 'v1', 'v2']
        ], [
          [
            'tag',
            'span',
            [],
            []
          ]
        ]
      ],
      [
        'text',
        [['constant', 'c1']]
      ]
    ]
  ]
  const result = "renderTemplate([renderTag('div',[renderAttPlain('p1','p2'),renderAttVariable('v1','v2')],[renderTag('span',[],[])]),renderTextConstant('c1')])"
  const str = buildTemplate(templateSchema as TagSchema)
  t.is(str, pretemplate + 'export const render = ' + result)
  t.end()
})
