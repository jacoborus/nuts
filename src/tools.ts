export const matchTextConst = /{{([^}]*)}}/;
export const matchTextVar = /{{:([^}]*)}}/;

export const camelToSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

export function coalesceDots(str: string): string {
  const arr = str.split('.');
  if (arr.length === 1) return str;
  return arr.join('?.');
}
