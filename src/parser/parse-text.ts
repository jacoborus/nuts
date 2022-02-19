import { RawTextSchema, TextSchema } from '../types';
import { matchDynamic } from '../common';
import { parseExpression } from './parse-expression';

export function parseText(schema: RawTextSchema): TextSchema[] {
  return parseChunk(schema.data);
}

export function parseChunk(
  str: string,
  chunks = [] as TextSchema[]
): TextSchema[] {
  // empty string
  if (!str.length) return chunks;
  const st = str.match(matchDynamic);
  // plain text
  if (!st) {
    return chunks.concat({
      type: 'text',
      value: str,
      dynamic: false,
      reactive: false,
    });
  }
  // plain chunk before interpolation
  if (st.index && st.index !== 0) {
    const value = str.slice(0, st.index);
    const rest = str.slice(st.index);
    return parseChunk(
      rest,
      chunks.concat({
        type: 'text',
        value,
        dynamic: false,
        reactive: false,
      })
    );
  }
  // interpolation
  let prop = st[1].trim();
  const rest = str.substring(st[0].length);
  const isReactive = prop.startsWith(':');
  if (isReactive) {
    // dynamic chunk
    prop = prop.slice(1).trim();
  }
  return parseChunk(
    rest,
    chunks.concat({
      type: 'text',
      value: prop,
      dynamic: true,
      reactive: isReactive,
      expr: parseExpression(prop),
    })
  );
}
