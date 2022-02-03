import test from "tape";

import { buildConditional } from "../../src/builder/build-conditional";
import { CondSchema } from "../../src/common";

test("Build#Conditional if-const", (t) => {
  const tagSchema = {
    kind: "conditionalConst",
    conditions: ["box => !!box.x?.y"],
    variables: ["x.y"],
    children: [
      {
        kind: "tag",
        name: "span",
        attribs: [],
        children: [],
      },
    ],
  };
  const result = "renderIfConst(box => !!box.x?.y,renderTag('span',[],[]))";
  const str = buildConditional(tagSchema as CondSchema);
  t.is(str, result);
  t.end();
});

test("Build#Conditional if-else-const", (t) => {
  const tagSchema = {
    kind: "conditionalConst",
    conditions: ["box => !!box.x?.y"],
    variables: ["x.y"],
    children: [
      {
        kind: "tag",
        name: "span",
        attribs: [],
        children: [],
      },
      {
        kind: "tag",
        name: "div",
        attribs: [],
        children: [],
      },
    ],
  };
  const result =
    "renderIfElseConst(box => !!box.x?.y,[renderTag('span',[],[]),renderTag('div',[],[])])";
  const str = buildConditional(tagSchema as CondSchema);
  t.is(str, result);
  t.end();
});

test("Build#Conditional if-var", (t) => {
  const tagSchema = {
    kind: "conditionalVar",
    conditions: ["box => !!box.x?.y"],
    variables: ["x.y"],
    children: [
      {
        kind: "tag",
        name: "span",
        attribs: [],
        children: [],
      },
    ],
  };
  const result =
    "renderIfVar(box => !!box.x?.y,['x.y'],renderTag('span',[],[]))";
  const str = buildConditional(tagSchema as CondSchema);
  t.is(str, result);
  t.end();
});

test("Build#Conditional if-else-var", (t) => {
  const tagSchema = {
    kind: "conditionalVar",
    conditions: ["box => !!box.x?.y"],
    variables: ["x.y"],
    children: [
      {
        kind: "tag",
        name: "span",
        attribs: [],
        children: [],
      },
      {
        kind: "tag",
        name: "div",
        attribs: [],
        children: [],
      },
    ],
  };
  const result =
    "renderIfElseVar(box => !!box.x?.y,['x.y'],[renderTag('span',[],[]),renderTag('div',[],[])])";
  const str = buildConditional(tagSchema as CondSchema);
  t.is(str, result);
  t.end();
});
