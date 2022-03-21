import { NodeTypes, ComponentSchema } from '../types';
import { Reader } from './reader';
import { parseComment, parseTemplate } from './parse-tag';
import { parseScript } from './parse-tag';

export function parseFile(sourceFile: string, source: string): ComponentSchema {
  const reader = new Reader(sourceFile, source);
  const file = {
    type: NodeTypes.COMPONENT,
    sourceFile,
    source,
    scripts: [],
    comments: [],
    children: [],
  } as ComponentSchema;

  while (reader.notFinished()) {
    reader.toNext(/\S/);
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
