import * as html from "html5parser";

type Attribs = Record<string, string>;
interface Schema {
  type: string;
  name?: string;
  data?: string;
  attribs?: object | undefined;
  children?: Schema[];
}

function findTemplate(schemas: Schema[]) {
  const schema = schemas.find((schema) => {
    return schema.type === "tag" && schema.name === "template";
  });
  return schema;
}

export function parseHTML(input: string): Schema {
  const ast = html.parse(input);
  const schema = ast.map(cleanRawSchema).filter(textEmpty);
  const template = findTemplate(schema);
  if (!template) {
    throw new Error("missing template");
  } else {
    return template;
  }
}

function textEmpty(tag: Schema) {
  return !(tag.type === "text" && "data" in tag && tag.data === "");
}

function cleanRawSchema(node: html.INode): Schema {
  if (node.type === "Text") {
    return {
      type: "text",
      data: node.value.trim(),
    };
  }
  const tag: html.ITag = node as html.ITag;
  const children = tag.body
    ? tag.body.map(cleanRawSchema).filter(textEmpty)
    : [];
  return {
    type: "tag",
    name: tag.name,
    attribs: cleanAttributes(tag.attributes),
    children,
  };
}

function cleanAttributes(attributes: html.IAttribute[]): Attribs {
  const atts: Attribs = {};
  attributes.forEach((att) => {
    const name = att.name.value;
    const value = att.value ? att.value.value : "";
    atts[name] = value;
  });
  return atts;
}
