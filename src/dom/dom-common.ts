import { Box } from 'boxes'

type VFn = (box: Box) => void
export type Setup = (box: Box) => VFn | void

// export type RenderComp = (scope?: Box) => RenderedNut

export type RenderedNut = (selector: string) => () => void

export interface RenderedComp {
  elem: Element | Text | null
  off?: () => void
}

export type Reprint = (subElem: Element | Text | null, i: number) => void
export type Off = () => void
export type RenderNut = (props?: object) => RenderedComp
export type RenderAtt = (elem: Element, scope: Box) => Off[]
export type RenderFn = (scope: Box, i?: number, reprint?: Reprint) => RenderedComp
export type RenderedTemplate = {
  render: RenderFn,
  createNut: (setup: Setup) => RenderNut
}
