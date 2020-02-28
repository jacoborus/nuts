import { on } from 'boxes'
type Box = { [index: string]: any }

interface RenderedComp {
  elem: Element | Text | DocumentFragment
  links: any[]
}

type RenderFn = (scope: Box) => RenderedComp
// type Updater = (kind: string, oldValue: any, newValue: any) => void

export function renderTextContent (...fns: RenderFn[]): RenderFn {
  return (scope: Box) => {
    const fragment = document.createDocumentFragment()
    const links: string[] = []
    fns.forEach((render: RenderFn) => {
      const comp = render(scope)
      fragment.appendChild(comp.elem)
      comp.links && comp.links.forEach(link => {
        links.push(link)
      })
    })
    return { elem: fragment, links }
  }
}

export function renderTextFixed (txt: string): RenderFn {
  return () => ({
    elem: document.createTextNode(txt),
    links: []
  })
}

export function renderTextConstant (prop: string): RenderFn {
  return (scope: Box) => ({
    elem: document.createTextNode(scope[prop]),
    links: []
  })
}

export function renderTextVariable (prop: string): RenderFn {
  return function (scope: Box) {
    const elem = document.createTextNode(scope[prop])
    const evCtrl = on(scope, prop, (_:string, __: string, newValue: any) => {
      elem.textContent = typeof newValue !== 'undefined' ? newValue : ''
    })
    const links = [evCtrl]
    return { elem, links }
  }
}
