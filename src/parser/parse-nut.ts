import { parseAttribs } from "./parse-attribs";

import { NutSchema, RawNutSchema } from "../common";

export function parseNut(schema: RawNutSchema): NutSchema {
  const { name } = schema;
  const attribs = parseAttribs(schema);
  const props = attribs.filter((attrib) => attrib.kind === "prop") || [];
  return { kind: "nut", name, props };
}
