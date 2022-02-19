import { AttSchema, FinalAttType } from '../../src/common';

const atttypes = {
  plain: buildAttPlain,
  constant: buildAttConstant,
  variable: buildAttVariable,
  event: buildAttEvent,
  booleanConst: buildAttBoolConst,
  booleanVar: buildAttBoolVar,
  cssclass: buildAttClass,
};

export function buildAttribs(defs: AttSchema[]): string {
  return defs
    .map((schema) => {
      return atttypes[schema.type as FinalAttType](schema);
    })
    .join(',');
}

export function buildAttPlain(schema: AttSchema): string {
  return `renderAttPlain('${schema.propName}','${schema.value}')`;
}

export function buildAttConstant(schema: AttSchema): string {
  const literalFn = 'box => `' + schema.value + '`';
  return `renderAttConstant('${schema.propName}',${literalFn})`;
}

export function buildAttVariable(schema: AttSchema): string {
  const literalFn =
    'box => `' + schema.value + "`,['" + schema.variables.join("','") + "']";
  return `renderAttVariable('${schema.propName}',${literalFn})`;
}

export function buildAttEvent(schema: AttSchema): string {
  return `renderAttEvent('${schema.propName}','${schema.value}')`;
}

export function buildAttBoolConst(schema: AttSchema): string {
  return `renderAttBoolConst('${schema.propName}','${schema.value}')`;
}

export function buildAttBoolVar(schema: AttSchema): string {
  const variables = "['" + schema.variables.join("','") + "']";
  return `renderAttBoolVar('${schema.propName}','${schema.value}',${variables})`;
}

export function buildAttClass(schema: AttSchema): string {
  return `renderAttPlain('${schema.propName}','${schema.value}')`;
}
