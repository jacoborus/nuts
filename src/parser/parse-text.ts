import { RawTextSchema, TextSchema, TextChunk } from '../types';
import { matchDynamic } from '../common';

export function parseText(schema: RawTextSchema): TextSchema {
  const kind = 'text';
  return {
    kind,
    chunks: parseChunk(schema.data),
  };
}

export function coalesceDots(str: string): string {
  const arr = str.split('.');
  if (arr.length === 1) return str;
  return arr.join('?.');
}

export function parseChunk(
  str: string,
  chunks = [] as TextChunk[]
): TextChunk[] {
  // empty string
  if (!str.length) return chunks;
  const st = str.match(matchDynamic);
  // plain text
  if (!st) {
    return chunks.concat({
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
      value: prop,
      dynamic: true,
      reactive: isReactive,
    })
  );
}
