import test from "tape";
import { getBox } from "boxes";
import { renderTag } from "../../src/dom/dom-tag";
import { renderTextPlain } from "../../src/dom/dom-text";
import {
  renderIfConst,
  renderIfElseConst,
  renderIfVar,
  renderIfElseVar,
} from "../../src/dom/dom-conditional";

test("DOM: renderIfConst", (t) => {
  const render = renderIfConst((box) => !!box.x, renderTextPlain("hola"));
  const box = getBox({ x: 1 });
  const comp = render(box);
  t.ok(comp && comp.elem);
  box.x = 0;
  const comp2 = render(box);
  t.notOk(comp2?.elem);
  t.end();
});

test("DOM: renderIfElseConst", (t) => {
  const render = renderIfElseConst(
    (box) => !!box.x,
    [renderTextPlain("hola"), renderTag("span", [], [])]
  );
  const box = getBox({ x: 1 });
  const comp = render(box);
  const elem = comp.elem as Text;
  t.is(elem.textContent, "hola");
  box.x = 0;
  t.end();
});

test("DOM: renderIfVar", (t) => {
  const render = renderIfVar((box) => !!box.x, ["x"], renderTextPlain("hola"));
  const box = getBox({ x: 1 });
  const results = [
    [false, 2],
    [true, 2],
  ];
  t.plan(results.length + 1);
  const comp = render(box, 2, (subElem, n) =>
    t.same([!!subElem, n], results.shift())
  );
  const elem = comp.elem as Text;
  t.is(elem.textContent, "hola", "text content");
  box.x = 0;
  box.x = false;
  box.x = 99;
  comp.off();
  box.x = undefined;
  box.x = 53;
  t.end();
});

test("DOM: renderIfElseVar", (t) => {
  const render = renderIfElseVar(
    (box) => !!box.x,
    ["x"],
    [renderTextPlain("hola"), renderTextPlain("adios")]
  );
  const box = getBox({ x: 1 });
  const results = ["adios", "hola"];
  t.plan(results.length + 1);
  const comp = render(box, 2, (subElem) => {
    const el = subElem as Text;
    t.same(el.textContent, results.shift());
  });
  const elem = comp.elem as Text;
  t.is(elem.textContent, "hola", "text content");
  box.x = 0;
  box.x = false;
  box.x = 99;
  t.end();
});
