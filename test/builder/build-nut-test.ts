import test from "tape";

import { buildNut } from "../../src/builder/build-nut";
import { NutSchema } from "../../src/common";

test("Build#Nut", (t) => {
  const nutSchema = {
    kind: "nut",
    name: "my-comp",
    props: [
      {
        kind: "plain",
        propName: "p1",
        value: "v1",
      },
      {
        kind: "variable",
        propName: "p2",
        value: "v2",
      },
    ],
  };
  const result = "renderNut('my-comp',renderProps({'p1':'v1','p2':'v2'}))";
  const str = buildNut(nutSchema as NutSchema);
  t.is(str, result);
  t.end();
});
