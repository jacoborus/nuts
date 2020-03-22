import { on } from 'boxes'
type Box = { [index: string]: any }

interface RenderedComp {
  elem: Element | Text | DocumentFragment
  links: any[]
}

type RenderFn = (scope: Box) => RenderedComp
// type Updater = (kind: string, oldValue: any, newValue: any) => void

export function renderTextPlain (prop: string): RenderFn {
  return () => ({
    elem: document.createTextNode(prop),
    links: []
  })
}

export function renderTextConstant (literalFn: (box: Box) => string): RenderFn {
  return (scope: Box) => ({
    elem: document.createTextNode(literalFn(scope)),
    links: []
  })
}

export function renderTextVariable (literalFn: (box: Box) => string, variables: string[]): RenderFn {
  return function (scope: Box) {
    const elem = document.createTextNode(literalFn(scope))
    const links = variables.map(variable => {
      return on(scope, variable, (_:string, __: any, ___: any, box: Box) => {
        elem.textContent = literalFn(box)
      })
    })
    return { elem, links }
  }
}
