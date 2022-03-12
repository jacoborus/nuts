import { AttSchema, NodeTypes } from '../types';
import { booleanAttributes } from '../common';
import { Reader } from './reader';

export function parseAttribs(reader: Reader): AttSchema[] {
  const attribs: AttSchema[] = [];
  reader.toNextWord();

  while (!reader.isTagHeadEnd()) {
    attribs.push(parseAttribute(reader));
    if (reader.char() === '>') break;
    reader.toNextWord();
  }
  reader.next();
  return attribs;
}

export function parseAttribute(reader: Reader): AttSchema {
  const start = reader.getIndex();
  const rest = reader.slice();
  const separator = rest.match(/\s|=/);
  if (!separator || !separator.index) throw new Error('Wrong attribute name');
  const prename = rest.slice(0, separator.index);
  const { name, dynamic, reactive, isEvent } = readAttribName(prename);
  const isBoolean = booleanAttributes.includes(name);
  reader.advance(prename + 1);
  let value = '';
  if (separator[0] === '=') {
    reader.toNext(/"|'/);
    const quote = reader.char();
    reader.next();
    const rest = reader.slice();
    const closerPos = rest.indexOf(quote);
    value = reader.slice(0, closerPos);
    reader.advance(value);
  }
  const end = reader.getIndex();
  reader.next();

  return {
    type: NodeTypes.ATTRIBUTE,
    name,
    value,
    isBoolean,
    isEvent,
    dynamic,
    reactive,
    expr: [],
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
      name: name.slice(2),
    };
  } else if (name.startsWith(':')) {
    return {
      dynamic: true,
      reactive: false,
      isEvent: false,
      name: name.slice(1),
    };
  } else if (name.startsWith('@')) {
    return {
      dynamic: false,
      reactive: false,
      isEvent: true,
      name: name.slice(1),
    };
  } else {
    return {
      dynamic: false,
      reactive: false,
      isEvent: false,
      name,
    };
  }
}
