import { on, BoxController } from 'boxes'

type Box = { [index: string]: any }

interface RenderedComp {
  elem: Element | Text | DocumentFragment
  links?: any[]
}

export type RenderAtt = (elem: Element, scope: Box) => BoxController[] | void
export type RenderFn = (scope: Box) => RenderedComp

export function renderAttPlain (att: string, value: string): RenderAtt {
  return (elem: Element) => { elem.setAttribute(att, value) }
}

export function renderAttConstant (att: string, value: string): RenderAtt {
  return (elem: Element, scope: Box) => {
    elem.setAttribute(att, scope[value])
  }
}

export function renderAttVariable (att: string, value: string): RenderAtt {
  return (elem: Element, scope: Box) => {
    elem.setAttribute(att, scope[value])
    const evCtrl = on(scope, value, (_:string, __: string, newValue: any) => {
      elem.setAttribute(att, newValue || '')
    })
    const links = [evCtrl]
    return links
  }
}
