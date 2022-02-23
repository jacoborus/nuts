import he from 'he';
import { SourceMapGenerator } from 'source-map';
import { matchDynamic } from '../common';
import lineColumn from 'line-column';

interface StrChunk {
  value: string;
  interpolation: boolean;
  loc: {
    line: number;
    column: number;
  };
}

type StrAst = StrChunk[];

export function parseString(
  input: string,
  index = 0,
  chunks = [] as StrAst
): StrAst {
  const str = input.slice(index);
  // empty string
  if (!str.length) return chunks;
  const st = str.match(matchDynamic);
  // plain text
  if (!st) {
    return chunks.concat({
      value: str,
      interpolation: false,
      loc: getLocation(input, index),
    });
  }
  // plain chunk before interpolation
  if (st.index && st.index !== 0) {
    const value = str.slice(0, st.index);
    const rest = str.slice(st.index);
    return parseString(
      input,
      input.length - rest.length,
      chunks.concat({
        value,
        interpolation: false,
        loc: getLocation(input, index),
      })
    );
  }
  // interpolation
  const rest = str.slice(st[0].length);
  return parseString(
    input,
    input.length - rest.length,
    chunks.concat({
      value: '{{' + he.encode(st[1]) + '}}',
      interpolation: true,
      loc: getLocation(input, index),
    })
  );
}

interface LineCol {
  line: number;
  col: number;
}

function getLocation(original: string, index: number) {
  const { line, col: column } = lineColumn(original).fromIndex(
    index
  ) as LineCol;
  return { line, column };
}

interface MappedInterpolation {
  code: string;
  map: SourceMapGenerator;
}

export function mapInterpolations(
  file: string,
  source: string,
  chunks: StrAst
): MappedInterpolation {
  const map = new SourceMapGenerator({ file });
  let code = '';
  chunks.forEach((chunk) => {
    code += chunk.value;
    map.addMapping({
      source,
      original: chunk.loc,
      generated: getLocation(code, code.length - 1),
    });
  });
  return { code, map };
}
