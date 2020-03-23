import { BoxController, Box } from 'boxes'

type VFn = (box: Box) => void
export type Setup = (box: Box) => VFn | void

// export type RenderComp = (scope?: Box) => RenderedNut

export type RenderedNut = (selector: string) => () => void

export interface RenderedComp {
  elem: Element | Text | DocumentFragment
  links: any[]
}

export type RenderNut = (props?: object) => RenderedComp
export type RenderAtt = (elem: Element, scope: Box) => BoxController[]
export type RenderFn = (scope: Box) => RenderedComp
export type RenderedTemplate = {
  render: RenderFn,
  createNut: (setup: Setup) => RenderNut
}
