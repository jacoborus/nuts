import { Box } from 'boxes'
import {
  RenderAtt,
  RenderFn,
  Off,
  Reprint
} from './dom-common'

export function renderTag (name: string, attribs: RenderAtt[], children: RenderFn[]) {
  return (scope: Box) => {
    const elem = document.createElement(name)
    const offs: Off[] = []
    attribs.forEach(attrib => offs.push(...attrib(elem, scope)))
    const vChildren: (Element | Text | null)[] = []
    const reprint: Reprint = (subElem, i) => {
      const oldElem = vChildren[i]
      if (!oldElem && !subElem) return
      else if (oldElem && subElem) oldElem.replaceWith(subElem)
      else if (oldElem) oldElem.remove()
      else {
        const nextIndex = vChildren.findIndex(child => child, i + 1)
        elem.insertBefore(subElem as Element, vChildren[nextIndex] || null)
      }
      vChildren[i] = subElem
    }
    children.forEach((childFn, i) => {
      const comp = childFn(scope, i, reprint)
      comp.elem && elem.appendChild(comp.elem)
      comp.off && offs.push(comp.off)
      vChildren.push(comp.elem)
    })
    return {
      elem,
      off: () => offs.forEach(off => off())
    }
  }
}
