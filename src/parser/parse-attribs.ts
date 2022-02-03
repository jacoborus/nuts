import {
  RawNutSchema,
  RawTagSchema,
  matcherConst,
  matcherVar,
  AttSchema,
} from '../common';
import { createStringParser, attIsBoolean } from '../tools';

export function parseAttribs(schema: RawTagSchema | RawNutSchema): AttSchema[] {
  const { attribs } = schema;
  const list: AttSchema[] = [];
  Object.keys(attribs).forEach((att) => {
    const value = attribs[att];
    const attType = getAttType(att, value);
    const parser = parsers[attType];
    const parsed = parser(att, value);
    list.push(parsed);
  });
  return list;
}

function getAttType(att: string, value: string) {
  if (att === 'class') return 'cssclass';
  if (att.startsWith('@')) return 'event';
  if (att.startsWith(':')) return 'prop';
  if (att === '(index)') {
    return valueIsVariable(value) ? 'indexVar' : 'indexConst';
  }
  if (attIsCond(att)) {
    return valueIsVariable(value) ? 'conditionalVar' : 'conditionalConst';
  }
  if (attIsBoolean(att)) {
    return valueIsVariable(value) ? 'booleanVar' : 'booleanConst';
  }
  return !value.match(matcherConst)
    ? 'plain'
    : value.match(matcherVar)
    ? 'variable'
    : 'constant';
}

function valueIsVariable(value: string): boolean {
  return value.trim().startsWith(':');
}

const conditionalKeys = ['(if)', '(else)'];
function attIsCond(att: string): boolean {
  return conditionalKeys.some((name) => name === att);
}

const parsers = {
  plain: parseAttPlain,
  constant: parseAttConstant,
  variable: parseAttVariable,
  booleanVar: parseBooleanVar,
  booleanConst: parseBooleanConst,
  event: parseAttEvent,
  conditionalConst: parseConditionalConst,
  conditionalVar: parseConditionalVar,
  prop: parseProp,
  cssclass: parseClass,
  indexVar: parseIndexVar,
  indexConst: parseIndexConst,
};

function parseAttPlain(att: string, value: string): AttSchema {
  return {
    kind: 'plain',
    propName: att,
    value,
    variables: [],
  };
}

function parseAttConstant(att: string, value: string): AttSchema {
  const parseStr = createStringParser('attribute');
  const { literal } = parseStr({ str: value.trim() });
  return {
    kind: 'constant',
    propName: att,
    value: literal,
    variables: [],
  };
}

function parseAttVariable(att: string, value: string): AttSchema {
  const parseStr = createStringParser('attribute');
  const { literal, variables } = parseStr({ str: value.trim() });
  return {
    kind: 'variable',
    propName: att,
    value: literal,
    variables,
  };
}

function parseAttEvent(att: string, value: string): AttSchema {
  const propName = att.slice(1);
  return {
    kind: 'event',
    propName,
    value: value.trim(),
    variables: [],
  };
}

function parseBooleanConst(att: string, value: string): AttSchema {
  const val = value.trim();
  return {
    kind: 'booleanConst',
    propName: att,
    value: val,
    variables: [],
  };
}

function parseBooleanVar(att: string, value: string): AttSchema {
  const val = value.trim().slice(1).trim();
  return {
    kind: 'booleanVar',
    propName: att,
    value: val,
    variables: [val],
  };
}

function parseConditionalConst(att: string, value: string): AttSchema {
  return {
    kind: 'conditionalConst',
    propName: att,
    value: value.trim(),
    variables: [],
  };
}

function parseConditionalVar(att: string, value: string): AttSchema {
  const val = value.trim().slice(1).trim();
  return {
    kind: 'conditionalVar',
    propName: att,
    value: val,
    variables: [val],
  };
}

function parseProp(att: string, value: string): AttSchema {
  const propName = att.slice(1);
  const val = value.trim();
  return {
    kind: 'prop',
    propName,
    value: val,
    variables: [val],
  };
}

function parseClass(att: string, value: string): AttSchema {
  return {
    kind: 'cssclass',
    propName: att,
    value: value.trim(),
    variables: [],
  };
}

function parseIndexConst(att: string, value: string): AttSchema {
  return {
    kind: 'indexConst',
    propName: att,
    value: value.trim(),
    variables: [],
  };
}

function parseIndexVar(att: string, value: string): AttSchema {
  const val = value.trim().slice(1).trim();
  return {
    kind: 'indexVar',
    propName: att,
    value: val,
    variables: [],
  };
}
