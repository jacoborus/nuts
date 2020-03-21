import {
  AttSchema
} from '../../src/common'

export function buildProps (props: AttSchema[]): string {
  const content = props.map(prop => `'${prop.propName}':'${prop.value}'`).join(',')
  const objectProps = '{' + content + '}'
  return `renderProps(${objectProps})`
}
