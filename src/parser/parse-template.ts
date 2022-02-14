import { RawTagSchema, RawSchema } from '../types';
import { parseChildren } from '../parser/parse-children';
import { getTagname, findTagByTagname } from '../tools';

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
