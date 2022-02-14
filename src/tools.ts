import { RawSchema, RawTagSchema } from './types';

export const matchTextConst = /{{([^}]*)}}/;
export const matchTextVar = /{{:([^}]*)}}/;

export const camelToSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

export function coalesceDots(str: string): string {
  const arr = str.split('.');
  if (arr.length === 1) return str;
  return arr.join('?.');
}

export function findTagByTagname(
  schemas: RawSchema[],
  tagName: string
): RawTagSchema[] {
  return schemas.filter((schema): schema is RawTagSchema => {
    return schema.type === 'tag' && schema.name === tagName;
  });
}

export function getTagname(schema: RawTagSchema): string {
  if (schema.attribs.name) return schema.attribs.name;
  return (
    Object.keys(schema.attribs)
      .find((att) => att.startsWith('#'))
      ?.slice(1) || 'main'
  );
}
