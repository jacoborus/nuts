import { on, BoxController, Box } from 'boxes'
import {
  RenderAtt
} from './dom-common'

export function renderAttPlain (att: string, value: string): RenderAtt {
  return (elem: Element) => {
    elem.setAttribute(att, value)
    return []
  }
}

export function renderAttConstant (att: string, literalFn: (box: Box) => string): RenderAtt {
  return (elem: Element, scope: Box) => {
    elem.setAttribute(att, literalFn(scope))
    return []
  }
}

export function renderAttVariable (att: string, literalFn: (box: Box) => string, variables: string[] = []): RenderAtt {
  return (elem: Element, scope: Box) => {
    elem.setAttribute(att, literalFn(scope))
    const links = variables.map(variable => {
      return on(scope, variable, () => {
        elem.setAttribute(att, literalFn(scope))
      })
    })
    return links
  }
}

export function renderAttEvent (att: string, value: string): RenderAtt {
  return (elem: Element, scope: Box) => {
    const listener = (e: Event) => scope[value](e, scope)
    elem.addEventListener(att, listener)
    const evCtrl = { off () { elem.removeEventListener(att, listener) } }
    return [evCtrl as BoxController]
  }
}
