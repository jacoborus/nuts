import { TextSchema, NodeTypes } from '../types';
import { parseExpression } from './parse-expression';
import { Reader } from './reader';

export function parseText(
  reader: Reader,
  chunks = [] as TextSchema[]
): TextSchema[] {
  if (reader.char() === '<') return chunks;
  const start = reader.getIndex();
  if (reader.isX('{{')) {
    const reactive = reader.isX('{{:');
    const value = reader.toNext(/\}\}/) + '}}';
    reader.next();
    const end = reader.getIndex();
    reader.next();
    const chunk: TextSchema = {
      type: NodeTypes.TEXT,
      value,
      dynamic: true,
      reactive,
      start,
      end,
    };
    const firstCharPos = reactive ? 3 : 2;
    chunk.expr = parseExpression(value.slice(firstCharPos, -2));
    return parseText(reader, chunks.concat(chunk));
  }
  const value = reader.toNext(/(\{\{)|</);
  const chunk: TextSchema = {
    type: NodeTypes.TEXT,
    value,
    dynamic: false,
    reactive: false,
    start,
    end: reader.getIndex() - 1,
  };
  return parseText(reader, chunks.concat(chunk));
}
