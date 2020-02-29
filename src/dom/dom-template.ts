import { BoxController } from 'boxes'
import {
  Box,
  RenderFn
} from './dom-common'

export function renderTemplate (renderFns: RenderFn[]): RenderFn {
  return (scope: Box) => {
    const fragment = document.createDocumentFragment()
    const links: BoxController[] = []
    renderFns.forEach(renderFn => {
      const comp = renderFn(scope)
      fragment.appendChild(comp.elem)
      links.push(...comp.links)
    })
    return { elem: fragment, links }
  }
}
