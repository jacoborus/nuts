import test from 'tape'

import { buildNut } from '../../src/builder/build-nut'
import { NutSchema } from '../../src/common'

test('Build#Nut', t => {
  const nutSchema = [
    'nut',
    'my-comp',
    [
      ['plain', 'p1', 'p2'],
      ['variable', 'v1', 'v2']
    ]
  ]
  const result = "renderNut('my-comp',[renderAttPlain('p1','p2'),renderAttVariable('v1','v2')])"
  const str = buildNut(nutSchema as NutSchema)
  t.is(str, result)
  t.end()
})
