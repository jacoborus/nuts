import { RawTextSchema, RawTagSchema, RawSchema } from '../types';
import { getTagname, findTagByTagname } from '../tools';

export function parseScripts(schemas: RawSchema[]) {
  const scriptSchemas = findTagByTagname(schemas, 'script');
  return scriptSchemas.map(parseScript);
}

export function parseScript(schema: RawTagSchema) {
  const child = schema.children[0] as RawTextSchema;
  return {
    name: getTagname(schema),
    lang: schema.attribs.lang || 'js',
    value: child.data,
  };
}
