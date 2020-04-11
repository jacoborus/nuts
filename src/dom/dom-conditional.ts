import { Box, on } from 'boxes'
import {
  RenderFn,
  Reprint
} from './dom-common'

type CondFn = (box: Box) => any

export function renderIfConst (condition: CondFn, child: RenderFn) {
  return (scope: Box) => condition(scope) ? child(scope) : null
}

export function renderIfElseConst (condition: CondFn, children: RenderFn[]) {
  return (scope: Box) => children[+!condition(scope)](scope)
}

export function renderIfVar (condition: CondFn, variables: string[], child: RenderFn) {
  const children = [child, () => ({ elem: null })]
  return renderIfElseVar(condition, variables, children)
}

export function renderIfElseVar (condition: CondFn, variables: string[], children: RenderFn[]) {
  return (scope: Box, i: number, reprint: Reprint) => {
    let cached = condition(scope)
    const comp = children[+!cached](scope)
    let childOff = comp.off
    const off = on(scope, variables[0], (box: Box) => {
      if (cached === condition(box)) return
      cached = !cached
      childOff && childOff()
      const newComp = children[+!cached](box)
      childOff = newComp.off
      reprint(newComp.elem, i)
    }).off
    return {
      elem: comp.elem,
      off: () => {
        off()
        childOff && childOff()
      }
    }
  }
}
