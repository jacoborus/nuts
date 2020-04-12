import { getBox, Box } from 'boxes'
import {
  RenderFn,
  RenderedComp,
  RenderedTemplate,
  RenderNut,
  Setup
} from './dom-common'

export function renderTemplate (renderFn: RenderFn): RenderedTemplate {
  let finalSetup: Setup = function (_: Box) {}

  function createNut (setup: Setup): RenderNut {
    finalSetup = setup
    return renderComponent
  }

  function render (scope: object = {}) {
    const box = getBox(scope)
    return renderFn(box)
  }

  function renderComponent (props?: object): RenderedComp {
    props = props || {}
    const scope = getBox({ props })
    const afterMount = finalSetup(scope)
    const comp = renderFn(scope)
    afterMount && afterMount(scope)
    return comp
  }

  return { render, createNut }
}
