import { NodeTypes, RootSchema } from '../types';
import { Reader } from './reader';
import { parseComment, parseScript, parseTemplate } from './parse-tag';

export function parseFile(sourceFile: string, source: string): RootSchema {
  const reader = new Reader(sourceFile, source);
  const file = {
    type: NodeTypes.COMPONENT,
    sourceFile,
    source,
    scripts: [],
    comments: [],
    children: [],
  } as RootSchema;

  while (reader.notFinished()) {
    reader.toNextWord();
    if (reader.isCommentTag()) {
      const comment = parseComment(reader);
      file.comments.push(comment);
      continue;
    }
    if (reader.isScriptTag()) {
      const script = parseScript(reader);
      file.scripts.push(script);
      continue;
    }
    if (reader.isTemplate()) {
      const template = parseTemplate(reader);
      if (!file.template) file.template = template;
      continue;
    }
  }
  return file;
}
