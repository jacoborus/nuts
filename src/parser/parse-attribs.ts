import { AttSchema, NodeTypes, directiveNames, Expression } from '../types';
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
  const prename = reader.toNext(/\s|=|>|\/>/);
  const separator = reader.char();
  if (typeof separator === 'undefined') throw new Error('Wrong attribute name');
  const { name, dynamic, reactive, isEvent, isDirective } =
    readAttribName(prename);
  const isBoolean = !isDirective && booleanAttributes.includes(name);
  let value = '';
  let expr = undefined;
  let end = reader.getIndex() - 1;
  if (separator === '=') {
    reader.next();
    [value, expr] = parseAttValue(reader, dynamic || isDirective);
    end = reader.getIndex() - 1;
  }

  return {
    type: NodeTypes.ATTRIBUTE,
    name,
    value,
    isBoolean,
    isEvent,
    dynamic,
    reactive,
    isDirective,
    expr,
    start,
    end,
  };
}

function readAttribName(name: string) {
  if (name.startsWith('::')) {
    return {
      dynamic: true,
      reactive: true,
      isEvent: false,
      isDirective: false,
      name: name.slice(2),
    };
  } else if (name.startsWith(':')) {
    return {
      dynamic: true,
      reactive: false,
      isDirective: false,
      isEvent: false,
      name: name.slice(1),
    };
  } else if (name.startsWith('@')) {
    return {
      dynamic: false,
      reactive: false,
      isDirective: false,
      isEvent: true,
      name: name.slice(1),
    };
  } else if (attNameIsDirective(name)) {
    return {
      dynamic: false,
      reactive: false,
      isEvent: false,
      isDirective: true,
      name: name.slice(1, -1),
    };
  } else {
    return {
      dynamic: false,
      isDirective: false,
      reactive: false,
      isEvent: false,
      name,
    };
  }
}

export function parseAttValue(
  reader: Reader,
  dynamic: boolean
): [string, Expression?] {
  const quote = reader.char();
  const isQuoted = ['"', "'"].includes(quote);
  if (!dynamic) {
    isQuoted && reader.next();
    const value = isQuoted
      ? reader.toNext(new RegExp(quote))
      : reader.toNext(/\s|>/);
    isQuoted && reader.next();
    return [value];
  }
  const rest = reader.slice();
  const expr = parseExpression(reader);
  const value = rest.slice(1, expr.end - expr.start);
  return [value, expr];
}

function attNameIsDirective(name: string): boolean {
  return (
    name.startsWith('(') &&
    name.endsWith(')') &&
    directiveNames.includes(name.slice(1, -1))
  );
}
