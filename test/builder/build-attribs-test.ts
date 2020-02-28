import test from 'tape'
import {
  AttDef
} from '../../src/common'

import { buildAtts } from '../../src/builder/build-attribs'

test('BuildAtts', t => {
  const atts: AttDef[] = [
    ['plain', 'p1', 'p2'],
    ['constant', 'c1', 'c2'],
    ['variable', 'v1', 'v2']
  ]

  const result = "renderAttPlain('p1','p2'),renderAttConstant('c1','c2'),renderAttVariable('v1','v2')"

  const built = buildAtts(atts)
  t.is(built, result)
  t.end()
})
