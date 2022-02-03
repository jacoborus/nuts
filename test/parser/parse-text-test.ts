import test from "tape";
import { parseText } from "../../src/parser/parse-text";

const baseComp = {
  type: "text",
  data: "",
};

test("Parse#textPlain empty", (t) => {
  const result = {
    kind: "text",
    mode: "plain",
    literal: "",
    variables: [],
  };
  const parsed = parseText(baseComp);
  t.same(parsed, result);
  t.end();
});

test("Parse#textPlain", (t) => {
  const result = {
    kind: "text",
    mode: "plain",
    literal: "hola mundo ",
    variables: [],
  };
  const schema = Object.assign({}, baseComp, { data: "hola mundo " });
  const parsed = parseText(schema);
  t.same(parsed, result);
  t.end();
});

test("Parse#textConstant", (t) => {
  const result = {
    kind: "text",
    mode: "constant",
    literal: "counter ${box.count ?? ''}.",
    variables: [],
  };
  const schema = Object.assign({}, baseComp, { data: "counter {{ count }}." });
  const parsed = parseText(schema);
  t.same(parsed, result);
  t.end();
});

test("Parse#textVar", (t) => {
  const result = {
    kind: "text",
    mode: "variable",
    literal: "Fixed ${box.constantino ?? ''} y ${box.valentina ?? ''}",
    variables: ["valentina"],
  };
  const schema = Object.assign({}, baseComp, {
    data: "Fixed {{ constantino }} y {{: valentina }}",
  });
  const parsed = parseText(schema);
  t.same(parsed, result);
  t.end();
});
