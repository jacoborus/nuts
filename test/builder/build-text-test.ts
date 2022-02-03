import test from "tape";
import { TextSchema } from "../../src/common";

import { buildText } from "../../src/builder/build-text";

test("Build#TextContent plain", (t) => {
  const schema = {
    kind: "text",
    mode: "plain",
    literal: "uno",
    variables: [],
  };
  const result = "renderTextPlain('uno')";
  const built = buildText(schema as TextSchema);
  t.is(built, result);
  t.end();
});

test("Build#TextContent constant", (t) => {
  const schema = {
    kind: "text",
    mode: "constant",
    literal: "${box.uno ?? ''}",
    variables: [],
  };
  const result = "renderTextConstant(box => `${box.uno ?? ''}`, [])";
  const built = buildText(schema as TextSchema);
  t.is(built, result);
  t.end();
});

test("Build#TextContent variable", (t) => {
  const schema = {
    kind: "text",
    mode: "variable",
    literal: "${box.uno ?? ''}",
    variables: ["uno", "dos"],
  };
  const result = "renderTextVariable(box => `${box.uno ?? ''}`, ['uno','dos'])";
  const built = buildText(schema as TextSchema);
  t.is(built, result);
  t.end();
});
