import { getBox } from 'boxes'
import {
  Box,
  RenderFn
} from './dom-common'

export function renderComponent (renderTemplate: RenderFn) {
  return (scope: Box = {}) => {
    scope = getBox(scope)
    const comp = renderTemplate(scope)
    let parentNode: Element
    return {
      mount (target: Element) {
        target.appendChild(comp.elem)
        parentNode = target
      },
      unmount () {
        comp.links.forEach(link => link.off())
        parentNode.removeChild(comp.elem)
      }
    }
  }
}
