import { BoxController, getBox } from 'boxes'
import {
  Box,
  RenderFn,
  RenderComp,
  RenderedNut
} from './dom-common'

export function renderTemplate (renderFns: RenderFn[]): RenderComp {
  function renderComponent (scope: Box) {
    const fragment = document.createDocumentFragment()
    const links: BoxController[] = []
    renderFns.forEach(renderFn => {
      const comp = renderFn(scope)
      fragment.appendChild(comp.elem)
      links.push(...comp.links)
    })
    return { elem: fragment, links }
  }
  return (setup?: (box: Box) => void, props: object = {}): RenderedNut => {
    const scope = getBox(props)
    if (setup) setup(scope)
    const comp = renderComponent(scope)
    let parentNode: Element
    return function mount (target: Element) {
      target.appendChild(comp.elem)
      parentNode = target
      return function () {
        comp.links.forEach(link => link.off())
        parentNode.removeChild(comp.elem)
      }
    }
  }
}
