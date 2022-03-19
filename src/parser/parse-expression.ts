import { Expression, ExprMethod, Slab } from '../types';
import { Reader } from './reader';

// Expressions are delimited by double curly braces `{}`
// Sub-expressions are delimited by brackets `[]`
//
// if expression starts with:
// - @: method
// - $: context
// - character: scope
//
// Example
// {@join:$route.params.id,user.name}
// Example
// {@join:$route.params.id,[@text.capitalize:user.name]}
// Example passing object as param
// {@user:person,[url=www.jacoborus.codes,color='#acf']}

const closers = {
  '{': '}',
  '[': ']',
  '"': '"',
  "'": "'",
};

export function parseExpression(reader: Reader): Expression {
  const start = reader.getIndex();
  const opener = reader.char();
  const closer = closers[opener as keyof typeof closers];
  reader.advance(1);
  reader.toNext(/\S/);
  const scope = getExprScope(reader);
  const slabs = parseSlabs(reader, closer);
  reader.toNext(new RegExp(closer));
  const end = reader.getIndex();
  reader.next();
  return {
    start,
    end,
    scope,
    slabs,
  };
}

export function getExprScope(reader: Reader): number {
  const first = reader.char();
  if (first === '@') return -1;
  if (first === '$') return 0;
  if (first !== '.') return 1;
  return getParentScope(reader);
}

export function getParentScope(reader: Reader, amount = 2): number {
  const prefix = reader.toNext(/\//);
  if (prefix !== '..') {
    throw new Error('wrog expression prefix');
  }
  reader.next();
  if (reader.char() === '.') return getParentScope(reader, amount + 1);
  return amount;
}

export function parseSlabs(
  reader: Reader,
  closer: string,
  slabs = [] as Slab[]
): Slab[] {
  reader.toNext(/\S/);
  const start = reader.getIndex();
  let value = reader.toNext(new RegExp('\\' + closer + '|\\.'));
  let end = reader.getIndex() - 1;
  const isLastChar = reader.char() === closer;
  value = value.trim();
  end = start + value.length - 1;
  !isLastChar && reader.next();
  const newSlabs = slabs.concat({ value, start, end });
  return isLastChar ? newSlabs : parseSlabs(reader, closer, newSlabs);
}

// export function parseMethod(reader: Reader): ExprMethod {}
