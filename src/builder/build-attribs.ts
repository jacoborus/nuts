import {
  AttSchema,
  AttType
} from '../../src/common'

const attKinds: {[K in AttType]: string} = {
  plain: 'renderAttPlain',
  constant: 'renderAttConstant',
  variable: 'renderAttVariable',
  event: 'renderAttEvent'
}

export function buildAttribs (defs: AttSchema[]): string {
  return defs.map(([kind, att, prop]) => {
    return `${attKinds[kind]}('${att}','${prop}')`
  })
    .join(',')
}
