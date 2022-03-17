import ts, { SourceFile } from 'typescript';

export function parseTs(path: string, code: string): SourceFile {
  return ts.createSourceFile(path, code, ts.ScriptTarget.Latest);
}
