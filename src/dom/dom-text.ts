import { on, Box } from "boxes";
import { RenderedComp } from "./dom-common";

type RenderFn = (scope: Box) => RenderedComp;
// type Updater = (kind: string, oldValue: any, newValue: any) => void

export function renderTextPlain(prop: string): RenderFn {
  return () => ({
    elem: document.createTextNode(prop),
  });
}

export function renderTextConstant(literalFn: (box: Box) => string): RenderFn {
  return (scope: Box) => ({
    elem: document.createTextNode(literalFn(scope)),
  });
}

export function renderTextVariable(
  literalFn: (box: Box) => string,
  variables: string[]
): RenderFn {
  return function (scope: Box) {
    const elem = document.createTextNode(literalFn(scope));
    const offs = variables.map((variable) => {
      return on(scope, variable, () => {
        elem.textContent = literalFn(scope);
      }).off;
    });
    return {
      elem,
      off: () => offs.forEach((off) => off()),
    };
  };
}
