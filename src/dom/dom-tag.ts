import { BoxController } from 'boxes'
import {
  Box,
  RenderAtt,
  RenderFn
} from './dom-common'

export function renderTag (name: string, attribs: RenderAtt[], children: RenderFn[]) {
  return (scope: Box) => {
    const elem = document.createElement(name)
    const links: BoxController[] = []
    attribs.forEach(attrib => {
      links.push(...attrib(elem, scope))
    })
    children.forEach(childFn => {
      const comp = childFn(scope)
      elem.appendChild(comp.elem)
      links.push(...comp.links)
    })
    return {
      elem,
      links
    }
  }
}
