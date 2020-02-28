import test from 'tape'
import {
  TextChunkSchema
} from '../../src/common'

import { buildText } from '../../src/builder/build-text'

test('Build#TextContent', t => {
  const chunks: TextChunkSchema[] = [
    ['plain', 'p1'],
    ['constant', 'c1'],
    ['variable', 'v1']
  ]

  const result = "renderTextPlain('p1'),renderTextConstant('c1'),renderTextVariable('v1')"

  const built = buildText(['text', chunks])
  t.is(built, result)
  t.end()
})
