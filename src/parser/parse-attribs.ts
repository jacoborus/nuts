import { AttSchema, NodeTypes, directiveNames, directiveTags } from '../types';
import { booleanAttributes } from '../common';
import { Reader } from './reader';
import { parseExpression } from './parse-expression';

export function parseAttribs(reader: Reader): AttSchema[] {
  const attribs: AttSchema[] = [];
  while (reader.tagHasMoreAttributes()) {
    reader.toNextWord();
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
  let end = reader.getIndex() - 1;
  if (separator === '=') {
    reader.toNext(/"|'/);
    const quote = reader.char();
    reader.next();
    value = reader.toNext(new RegExp(quote));
    value = value.trim();
    end = reader.getIndex();
    reader.next();
  }
  const expr =
    dynamic || directiveTags.includes(name) ? parseExpression(value) : [];

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

function attNameIsDirective(name: string): boolean {
  return (
    name.startsWith('(') &&
    name.endsWith(')') &&
    directiveNames.includes(name.slice(1, -1))
  );
}
