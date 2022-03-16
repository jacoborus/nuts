import { NodeTypes, ScriptSchema } from '../types';
import { Reader } from './reader';
import { parseTagHead } from './parse-tag';
import { parse as babelparser } from '@babel/parser';

export function parseScript(reader: Reader): ScriptSchema {
  const start = reader.getIndex();
  const { attributes } = parseTagHead(reader);
  const value = reader.toNext(/<\/script/);
  reader.advance(8);
  reader.toNext(/>/);
  const end = reader.getIndex();
  reader.next();
  const ast = babelparser(value);
  return {
    type: NodeTypes.SCRIPT,
    value,
    attributes,
    start,
    ast,
    end,
  };
}
