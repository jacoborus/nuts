import { ScriptSchema, CommentSchema, NodeTypes, RootSchema } from '../types';
import { Reader } from './reader';
import { parseAttribs } from './parse-attribs';

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
  }
  return file;
}

export function parseComment(reader: Reader): CommentSchema {
  const start = reader.getIndex();
  const closerIndex = reader.indexOf('-->');
  const type = NodeTypes.COMMENT;
  const value = reader.slice(4, closerIndex);
  const end = start + closerIndex + 2;
  reader.setIndex(end + 1);
  return { type, value, start, end };
}

export function parseScript(reader: Reader): ScriptSchema {
  const start = reader.getIndex();
  reader.advance('<script ');
  const attributes = parseAttribs(reader);
  const bodyEnd = reader.findNext(/<\/script/);
  const body = reader.slice(0, bodyEnd);
  reader.advance(bodyEnd + 8);
  reader.toNext(/>/);
  const end = reader.getIndex();

  return {
    type: NodeTypes.SCRIPT,
    value: body,
    attributes,
    start,
    end,
  };
}
