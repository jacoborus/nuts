import { on, BoxController } from 'boxes'
import {
  Box,
  RenderAtt
} from './dom-common'

export function renderAttPlain (att: string, value: string): RenderAtt {
  return (elem: Element) => {
    elem.setAttribute(att, value)
    return []
  }
}

export function renderAttConstant (att: string, value: string): RenderAtt {
  return (elem: Element, scope: Box) => {
    elem.setAttribute(att, scope[value])
    return []
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

export function renderAttEvent (att: string, value: string): RenderAtt {
  return (elem: Element, scope: Box) => {
    elem.addEventListener(att, scope[value])
    const evCtrl = { off () { elem.removeEventListener(att, scope[value]) } }
    return [evCtrl as BoxController]
  }
}
