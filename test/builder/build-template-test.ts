import test from 'tape'

import { buildTemplate } from '../../src/builder/build-template'
import { TemplateSchema } from '../../src/common'

test('Build template', t => {
  const templateSchema = [
    'template',
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
  const result = "renderTemplate([renderTag('div',[renderAttPlain('p1','p2'),renderAttVariable('v1','v2')],[renderTag('span',[],[])]),renderTextConstant('c1')]])"
  const str = buildTemplate(templateSchema as TemplateSchema)
  t.is(str, result)
  t.end()
})
