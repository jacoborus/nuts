import test from 'tape'

import { buildTag } from '../../src/builder/build-tag'
import { TagSchema } from '../../src/common'

test('Build#Tag', t => {
  const tagSchema = [
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
      ],
      [
        'text',
        [['constant', 'c1']]
      ]
    ]
  ]
  const result = "renderTag('div',[renderAttPlain('p1','p2'),renderAttVariable('v1','v2')],[renderTag('span',[],[]),renderTextConstant('c1')])"
  const str = buildTag(tagSchema as TagSchema)
  t.is(str, result)
  t.end()
})
