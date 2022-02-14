import * as html from 'html5parser';
import { parseTemplates } from '../parser/parse-template';
import { parseScripts } from '../parser/parse-script';
import { RawSchema, Attribs } from '../types';

export function parseHTML(input: string) {
  const ast = html.parse(input);
  const schema = ast.map(cleanRawSchema).filter(textEmpty);
  return {
    templates: parseTemplates(schema),
    scripts: parseScripts(schema as RawSchema[]),
  };
}

function textEmpty(tag: RawSchema): boolean {
  return !(tag.type === 'text' && 'data' in tag && tag.data === '');
}

function cleanRawSchema(node: html.INode): RawSchema {
  if (node.type === 'Text') {
    return {
      type: 'text',
      data: node.value.trim(),
    };
  }
  const tag: html.ITag = node;
  const children = tag.body
    ? tag.body.map(cleanRawSchema).filter(textEmpty)
    : [];
  return {
    type: 'tag',
    name: tag.name,
    attribs: cleanAttributes(tag.attributes),
    children,
  };
}

function cleanAttributes(attributes: html.IAttribute[]): Attribs {
  const atts: Attribs = {};
  attributes.forEach((att) => {
    const name = att.name.value;
    const value = att.value ? att.value.value : '';
    atts[name] = value;
  });
  return atts;
}
