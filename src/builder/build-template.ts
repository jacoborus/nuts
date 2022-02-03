import fs from "fs";
import path from "path";

import { TagSchema } from "../common";

import { buildTag } from "./build-tag";

export function buildTemplate(schema: TagSchema): string {
  const child = buildTag(schema);
  return printTemplate(child);
}

const pretemplate = fs.readFileSync(
  path.resolve(__dirname, "./pre-template.txt"),
  "UTF8"
);

function printTemplate(child: string): string {
  return (
    pretemplate +
    `export const { render, createNut } = renderTemplate(${child})`
  );
}
