import test from 'tape'
import {
  AttSchema
} from '../../src/common'

import { buildAttribs } from '../../src/builder/build-attribs'

test('Build attribs', t => {
  const atts: AttSchema[] = [
    ['plain', 'p1', 'p2'],
    ['constant', 'c1', 'c2'],
    ['variable', 'v1', 'v2'],
    ['event', 'e1', 'e2']
  ]

  const result = "renderAttPlain('p1','p2'),renderAttConstant('c1','c2'),renderAttVariable('v1','v2'),renderAttEvent('e1','e2')"

  const built = buildAttribs(atts)
  t.is(built, result)
  t.end()
})
