import { Box } from 'boxes'
import {
  RenderAtt,
  RenderFn,
  Off
} from './dom-common'

export function renderTag (name: string, attribs: RenderAtt[], children: RenderFn[]) {
  return (scope: Box) => {
    const elem = document.createElement(name)
    const offs: Off[] = []
    attribs.forEach(attrib => {
      offs.push(...attrib(elem, scope))
    })
    children.forEach(childFn => {
      const comp = childFn(scope)
      comp.elem && elem.appendChild(comp.elem)
      comp.off && offs.push(comp.off)
    })
    return {
      elem,
      off: () => offs.forEach(off => off())
    }
  }
}
