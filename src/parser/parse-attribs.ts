import { AttName, AttValue, AttSchema, NodeTypes } from '../types';
import { booleanAttributes } from '../common';
import { Reader } from './reader';
import { parseExpression } from './parse-expression';

export function parseAttribs(reader: Reader): AttSchema[] {
  const attribs: AttSchema[] = [];
  while (reader.tagHasMoreAttributes()) {
    reader.toNext(/\S/);
    attribs.push(parseAttribute(reader));
  }
  return attribs;
}

export function parseAttribute(reader: Reader): AttSchema {
  const start = reader.getIndex();
  const { name, dynamic, isDirective, reactive, isEvent } =
    readAttribName(reader);
  const isBoolean = !isDirective && booleanAttributes.includes(name.value);
  if (reader.char() !== '=') {
    return {
      type: NodeTypes.ATTRIBUTE,
      name,
      isBoolean,
      isEvent,
      dynamic,
      reactive,
      isDirective,
      start,
      end: reader.getIndex() - 1,
    };
  }
  reader.next();
  const value = parseAttValue(reader, dynamic || isDirective);
  const end = reader.getIndex() - 1;

  return {
    type: NodeTypes.ATTRIBUTE,
    name,
    value,
    isBoolean,
    isEvent,
    dynamic,
    reactive,
    isDirective,
    start,
    end,
  };
}

function readAttribName(reader: Reader) {
  const rest = reader.slice();
  const { dynamic, reactive, isEvent } = rest.startsWith('::')
    ? {
        dynamic: true,
        reactive: true,
        isEvent: false,
      }
    : rest.startsWith(':')
    ? {
        dynamic: true,
        reactive: false,
        isEvent: false,
      }
    : rest.startsWith('@')
    ? {
        dynamic: false,
        reactive: false,
        isEvent: true,
      }
    : {
        dynamic: false,
        reactive: false,
        isEvent: false,
      };
  if (dynamic || isEvent) reader.advance(1);
  if (reactive) reader.advance(1);
  const start = reader.getIndex();
  const prename = reader.toNext(/\s|=|>|(\/>)/);
  const end = start + prename.length - 1;
  const isDirective = prename.startsWith('(') && prename.endsWith(')');
  const name: AttName = {
    value: isDirective ? prename.slice(1, -1) : prename,
    start,
    end,
  };
  return { name, dynamic, isDirective, reactive, isEvent };
}

export function parseAttValue(reader: Reader, simple: boolean): AttValue {
  const quote = reader.char();
  const isQuoted = ['"', "'"].includes(quote);
  if (!simple) {
    const start = reader.getIndex();
    isQuoted && reader.next();
    const value = isQuoted
      ? reader.toNext(new RegExp(quote))
      : reader.toNext(/\s|>/);
    const end = reader.getIndex() - (isQuoted ? 0 : 1);
    isQuoted && reader.next();
    return { value, start, end };
  }
  const rest = reader.slice();
  const start = reader.getIndex();
  const expr = parseExpression(reader);
  const end = expr.end;
  const value = rest.slice(1, expr.end - expr.start).trim();
  return { value, expr, start, end };
}
