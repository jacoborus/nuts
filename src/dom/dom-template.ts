import { BoxController, getBox, Box } from 'boxes'
import {
  RenderFn,
  RenderedComp,
  RenderedTemplate,
  RenderNut,
  Setup
} from './dom-common'

export function renderTemplate (renderFns: RenderFn[]): RenderedTemplate {
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

  let finalSetup: Setup = function (_: Box) {}

  function createNut (setup: Setup): RenderNut {
    finalSetup = setup
    return renderNut
  }

  function render (scope: object = {}) {
    const box = getBox(scope)
    return renderComponent(box)
  }

  function renderNut (props?: object): RenderedComp {
    props = props || {}
    const scope = getBox({ props })
    const afterMount = finalSetup(scope)
    const { elem, links } = renderComponent(scope)
    afterMount && afterMount(scope)
    return { elem, links }
  }

  return { render, createNut }
}
