import test from "tape";
import { getBox } from "boxes";
import { renderTag } from "../../src/dom/dom-tag";
import { renderAttPlain, renderAttVariable } from "../../src/dom/dom-attrib";

test("DOM: renderTag", (t) => {
  const render = renderTag(
    "span",
    [
      renderAttPlain("uno", "one"),
      renderAttVariable("dos", (box) => `att ${box.a} ${box.b.c}`, [
        "a",
        "b.c",
      ]),
    ],
    [renderTag("span", [], []), renderTag("div", [], [])]
  );
  const box = getBox({ a: "one", b: { c: "uno" } });
  const comp = render(box);

  t.is(comp.elem.tagName, "SPAN", "render tag name");
  t.is(
    comp.elem.outerHTML,
    '<span uno="one" dos="att one uno"><span></span><div></div></span>',
    "render tag full"
  );

  box.a = "two";
  t.is(
    comp.elem.outerHTML,
    '<span uno="one" dos="att two uno"><span></span><div></div></span>',
    "change attribute"
  );

  comp.off();
  box.a = "adios";
  t.is(
    comp.elem.outerHTML,
    '<span uno="one" dos="att two uno"><span></span><div></div></span>',
    "off attribute"
  );
  t.end();
});
