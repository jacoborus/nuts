import { BoxController } from 'boxes'
export type Box = { [index: string]: any }

export interface RenderedComp {
  elem: Element | Text | DocumentFragment
  links: any[]
}

export type RenderAtt = (elem: Element, scope: Box) => BoxController[]
export type RenderFn = (scope: Box) => RenderedComp
