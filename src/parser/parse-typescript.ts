import ts, { SourceFile } from 'typescript';

export function parseTs(path: string, code: string): SourceFile {
  return ts.createSourceFile(path, code, ts.ScriptTarget.Latest);
}

// find exports and default export
// create object methods (@) with all exported methods
// rename default function (to __setup for example)
// create default export function:
// - pass arguments and its types (props, ctx)
// - embed rendered function as return statement
