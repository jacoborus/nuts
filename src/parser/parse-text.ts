import { TextSchema, NodeTypes } from '../types';
import { parseExpression } from './parse-expression';
import { Reader } from './reader';

export function parseText(
  reader: Reader,
  chunks = [] as TextSchema[]
): TextSchema[] {
  if (reader.char() === '<') return chunks;
  const start = reader.getIndex();
  if (reader.isX('{')) {
    const rest = reader.slice();
    const expr = parseExpression(reader);
    const end = expr.end;
    const value = rest.slice(0, end - start + 1);
    const chunk: TextSchema = {
      type: NodeTypes.TEXT,
      value,
      dynamic: true,
      reactive: false,
      expr,
      start,
      end,
    };
    return parseText(reader, chunks.concat(chunk));
  }
  const value = reader.toNext(/\{|</);
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
