import { RawTextSchema, TextSchema, NodeTypes } from '../types';
import { matchDynamic } from '../common';
import { parseExpression } from './parse-expression';

export function parseText(schema: RawTextSchema): TextSchema[] {
  const chunks = parseChunk(schema.data);
  return adjustChunksStart(chunks, schema.start);
}

function adjustChunksStart(chunks: TextSchema[], index: number): TextSchema[] {
  return chunks.map((chunk) => {
    return Object.assign({}, chunk, { start: chunk.start + index });
  });
}

export function parseChunk(
  input: string,
  index = 0,
  chunks = [] as TextSchema[]
): TextSchema[] {
  const str = input.slice(index);
  // empty string
  if (!str.length) return chunks;
  const st = str.match(matchDynamic);
  // plain text
  if (!st) {
    return chunks.concat({
      type: NodeTypes.TEXT,
      value: str,
      dynamic: false,
      reactive: false,
      start: index,
    });
  }
  // plain chunk before interpolation
  if (st.index && st.index !== 0) {
    const value = str.slice(0, st.index);
    return parseChunk(
      input,
      index + st.index,
      chunks.concat({
        type: NodeTypes.TEXT,
        value,
        dynamic: false,
        reactive: false,
        start: index,
      })
    );
  }
  // interpolation
  let prop = st[1].trim();
  const isReactive = prop.startsWith(':');
  if (isReactive) {
    // dynamic chunk
    prop = prop.slice(1).trim();
  }
  return parseChunk(
    input,
    index + st[0].length,
    chunks.concat({
      type: NodeTypes.TEXT,
      value: prop,
      dynamic: true,
      reactive: isReactive,
      expr: parseExpression(prop),
      start: index,
    })
  );
}
