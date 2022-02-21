import { RawTextSchema, RawTagSchema, RawSchema, ScriptSchema } from '../types';
import { parseChildren } from '../parser/parse-children';
import { getTagname, findTagByTagname } from '../tools';
import { parseHTML } from './parse-html';

export function parseComponent(data: string) {
  const ast = parseHTML(data);
  return {
    template: parseTemplates(ast),
    scripts: parseScripts(ast as RawSchema[]),
  };
}

export function parseTemplates(schemas: RawSchema[]) {
  const scriptSchemas = findTagByTagname(schemas, 'template');
  return scriptSchemas.map(parseTemplate);
}

export function parseTemplate(schema: RawTagSchema) {
  return {
    name: getTagname(schema),
    schema: parseChildren(schema.children),
  };
}

export function parseScripts(schemas: RawSchema[]) {
  const scriptSchemas = findTagByTagname(schemas, 'script');
  return scriptSchemas.map(parseScript);
}

export function parseScript(schema: RawTagSchema): ScriptSchema {
  const child = schema.children[0] as RawTextSchema;
  return {
    name: getTagname(schema),
    lang: schema.attribs.lang || 'js',
    value: child.data,
  };
}
