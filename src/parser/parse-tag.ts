import { parseAttribs } from "./parse-attribs";
import { parseConditional } from "./parse-conditional";
import { parseChildren } from "./parse-children";

import { RawTagSchema, TagSchema } from "../common";

export function parseTag(schema: RawTagSchema): TagSchema {
  const { name } = schema;
  const attribs = parseAttribs(schema);
  const preChildren = parseChildren(schema);
  const children = parseConditional(preChildren);
  return { kind: "tag", name, attribs, children };
}
