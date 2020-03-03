import { BoxController } from 'boxes'
export type Box = { [index: string]: any }

export type RenderComp = (setup?: (box: Box) => void, scope?: Box) => RenderedNut

export type RenderedNut = (target: Element) => () => void

export interface RenderedComp {
  elem: Element | Text | DocumentFragment
  links: any[]
}

export type RenderAtt = (elem: Element, scope: Box) => BoxController[]
export type RenderFn = (scope: Box) => RenderedComp
