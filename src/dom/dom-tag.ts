import { Box } from "boxes";
import { RenderAtt, RenderFn, Off, Reprint } from "./dom-common";

type VChildren = (Element | Text | null)[];
function getReprint(parent: Element, vChildren: VChildren): Reprint {
  return (subElem, i) => {
    const oldElem = vChildren[i] as Element;
    if (!oldElem && !subElem) return;
    else if (oldElem && subElem) oldElem.replaceWith(subElem);
    else if (oldElem) oldElem.remove();
    else {
      const nextIndex = vChildren.findIndex(
        (child) => child === subElem,
        i + 1
      );
      parent.insertBefore(subElem as Element, vChildren[nextIndex] || null);
    }
    vChildren[i] = subElem;
  };
}

export function renderTag(
  name: string,
  attribs: RenderAtt[],
  children: RenderFn[]
) {
  return (scope: Box) => {
    const elem = document.createElement(name);
    const offs: Off[] = [];
    attribs.forEach((attrib) => offs.push(...attrib(elem, scope)));
    const vChildren: VChildren = [];
    const reprint = getReprint(elem, vChildren);
    children.forEach((childFn, i) => {
      const comp = childFn(scope, i, reprint);
      comp.elem && elem.appendChild(comp.elem);
      comp.off && offs.push(comp.off);
      vChildren.push(comp.elem);
    });
    return {
      elem,
      off: () => offs.forEach((off) => off()),
    };
  };
}
