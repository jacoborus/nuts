import { tokenizeHtml } from "../src/tokenizer.ts";
import { Token, TokenKind } from "../src/types.ts";
import { assertEquals } from "https://deno.land/std@0.220.1/assert/mod.ts";

let tests: {
  name: string;
  input: string;
  ignore?: boolean;
  only?: boolean;
  result: Token[];
  expression?: boolean;
}[] = [
  {
    name: "tokenize html: simple void element",
    input: "<br>",
    result: [
      { start: 0, end: 0, type: TokenKind.OpenTag, value: "<" },
      { start: 1, end: 2, type: TokenKind.TagName, value: "br" },
      { start: 3, end: 3, type: TokenKind.OpenTagEnd, value: ">" },
    ],
  },
  {
    name: "tokenize html: simple void element preceeded by space",
    input: "  <br>",
    result: [
      { start: 0, end: 1, type: TokenKind.Literal, value: "  " },
      { start: 2, end: 2, type: TokenKind.OpenTag, value: "<" },
      { start: 3, end: 4, type: TokenKind.TagName, value: "br" },
      { start: 5, end: 5, type: TokenKind.OpenTagEnd, value: ">" },
    ],
  },
  {
    name: "tokenize html: comment",
    input: "  <!-- hola --> ",
    result: [
      { start: 0, end: 1, type: TokenKind.Literal, value: "  " },
      { start: 2, end: 5, type: TokenKind.OpenComment, value: "<!--" },
      { start: 6, end: 11, type: TokenKind.Comment, value: " hola " },
      { start: 12, end: 14, type: TokenKind.CloseComment, value: "-->" },
      { start: 15, end: 15, type: TokenKind.Literal, value: " " },
    ],
  },
  {
    name: "tokenize html: tag with no attribs",
    input: "<span>hola</span>",
    result: [
      { start: 0, end: 0, type: TokenKind.OpenTag, value: "<" },
      { start: 1, end: 4, type: TokenKind.TagName, value: "span" },
      { start: 5, end: 5, type: TokenKind.OpenTagEnd, value: ">" },
      { start: 6, end: 9, type: TokenKind.Literal, value: "hola" },
      { start: 10, end: 16, type: TokenKind.CloseTag, value: "</span>" },
    ],
  },
  {
    name: "tokenize html: tag with attribs",
    input: '<span id="myid">hola</span>',
    result: [
      { start: 0, end: 0, type: TokenKind.OpenTag, value: "<" },
      { start: 1, end: 4, type: TokenKind.TagName, value: "span" },
      { start: 5, end: 5, type: TokenKind.WhiteSpace, value: " " },
      { start: 6, end: 7, type: TokenKind.AttrName, value: "id" },
      { start: 8, end: 8, type: TokenKind.AttrEq, value: "=" },
      { start: 9, end: 9, type: TokenKind.DQuote, value: '"' },
      { start: 10, end: 13, type: TokenKind.AttrValue, value: "myid" },
      { start: 14, end: 14, type: TokenKind.DQuote, value: '"' },
      { start: 15, end: 15, type: TokenKind.OpenTagEnd, value: ">" },
      { start: 16, end: 19, type: TokenKind.Literal, value: "hola" },
      { start: 20, end: 26, type: TokenKind.CloseTag, value: "</span>" },
    ],
  },
  {
    name: "tokenize html: tag with unquoted attribs",
    input: "<span id=myid>hola</span>",
    result: [
      { start: 0, end: 0, type: TokenKind.OpenTag, value: "<" },
      { start: 1, end: 4, type: TokenKind.TagName, value: "span" },
      { start: 5, end: 5, type: TokenKind.WhiteSpace, value: " " },
      { start: 6, end: 7, type: TokenKind.AttrName, value: "id" },
      { start: 8, end: 8, type: TokenKind.AttrEq, value: "=" },
      { start: 9, end: 12, type: TokenKind.AttrValue, value: "myid" },
      { start: 13, end: 13, type: TokenKind.OpenTagEnd, value: ">" },
      { start: 14, end: 17, type: TokenKind.Literal, value: "hola" },
      { start: 18, end: 24, type: TokenKind.CloseTag, value: "</span>" },
    ],
  },
  {
    name: "tokenize html: tag with attrib then close tag",
    input: "<span mark>hola</span>",
    result: [
      { start: 0, end: 0, type: TokenKind.OpenTag, value: "<" },
      { start: 1, end: 4, type: TokenKind.TagName, value: "span" },
      { start: 5, end: 5, type: TokenKind.WhiteSpace, value: " " },
      { start: 6, end: 9, type: TokenKind.AttrName, value: "mark" },
      { start: 10, end: 10, type: TokenKind.OpenTagEnd, value: ">" },
      { start: 11, end: 14, type: TokenKind.Literal, value: "hola" },
      { start: 15, end: 21, type: TokenKind.CloseTag, value: "</span>" },
    ],
  },
  {
    name: "tokenize html tag with attribs and self closing",
    input: '<span :id="userid" class="hola"/>',
    result: [
      { start: 0, end: 0, type: TokenKind.OpenTag, value: "<" },
      { start: 1, end: 4, type: TokenKind.TagName, value: "span" },
      { start: 5, end: 5, type: TokenKind.WhiteSpace, value: " " },
      { start: 6, end: 8, type: TokenKind.AttrName, value: ":id" },
      { start: 9, end: 9, type: TokenKind.AttrEq, value: "=" },
      { start: 10, end: 10, type: TokenKind.DQuote, value: '"' },
      { start: 11, end: 16, type: TokenKind.AttrValue, value: "userid" },
      { start: 17, end: 17, type: TokenKind.DQuote, value: '"' },
      { start: 18, end: 18, type: TokenKind.WhiteSpace, value: " " },
      { start: 19, end: 23, type: TokenKind.AttrName, value: "class" },
      { start: 24, end: 24, type: TokenKind.AttrEq, value: "=" },
      { start: 25, end: 25, type: TokenKind.DQuote, value: '"' },
      { start: 26, end: 29, type: TokenKind.AttrValue, value: "hola" },
      { start: 30, end: 30, type: TokenKind.DQuote, value: '"' },
      { start: 31, end: 32, type: TokenKind.VoidTagEnd, value: "/>" },
    ],
  },
  {
    name: "tokenize hmtl: 2 sequential void tags",
    input: '<input type="text" id="myid"><br>',
    result: [
      { start: 0, end: 0, type: TokenKind.OpenTag, value: "<" },
      { start: 1, end: 5, type: TokenKind.TagName, value: "input" },
      { start: 6, end: 6, type: TokenKind.WhiteSpace, value: " " },
      { start: 7, end: 10, type: TokenKind.AttrName, value: "type" },
      { start: 11, end: 11, type: TokenKind.AttrEq, value: "=" },
      { start: 12, end: 12, type: TokenKind.DQuote, value: '"' },
      { start: 13, end: 16, type: TokenKind.AttrValue, value: "text" },
      { start: 17, end: 17, type: TokenKind.DQuote, value: '"' },
      { start: 18, end: 18, type: TokenKind.WhiteSpace, value: " " },
      { start: 19, end: 20, type: TokenKind.AttrName, value: "id" },
      { start: 21, end: 21, type: TokenKind.AttrEq, value: "=" },
      { start: 22, end: 22, type: TokenKind.DQuote, value: '"' },
      { start: 23, end: 26, type: TokenKind.AttrValue, value: "myid" },
      { start: 27, end: 27, type: TokenKind.DQuote, value: '"' },
      { start: 28, end: 28, type: TokenKind.OpenTagEnd, value: ">" },
      { start: 29, end: 29, type: TokenKind.OpenTag, value: "<" },
      { start: 30, end: 31, type: TokenKind.TagName, value: "br" },
      { start: 32, end: 32, type: TokenKind.OpenTagEnd, value: ">" },
    ],
  },
  {
    name: "tokenize html: script",
    input: `  <script lang="ts">;
    console.log('</div>');</script> `,
    result: [
      { start: 0, end: 1, type: TokenKind.Literal, value: "  " },
      { start: 2, end: 2, type: TokenKind.OpenTag, value: "<" },
      { start: 3, end: 8, type: TokenKind.TagName, value: "script" },
      { start: 9, end: 9, type: TokenKind.WhiteSpace, value: " " },
      { start: 10, end: 13, type: TokenKind.AttrName, value: "lang" },
      { start: 14, end: 14, type: TokenKind.AttrEq, value: "=" },
      { start: 15, end: 15, type: TokenKind.DQuote, value: '"' },
      { start: 16, end: 17, type: TokenKind.AttrValue, value: "ts" },
      { start: 18, end: 18, type: TokenKind.DQuote, value: '"' },
      { start: 19, end: 19, type: TokenKind.OpenTagEnd, value: ">" },
      {
        start: 20,
        end: 47,
        type: TokenKind.Literal,
        value: `;
    console.log('</div>');`,
      },
      { start: 48, end: 56, type: TokenKind.CloseTag, value: "</script>" },
      { start: 57, end: 57, type: TokenKind.Literal, value: " " },
    ],
  },
  {
    name: "tokenize html: style",
    input: `  <style lang="scss">
    body{colo</div>;}</style> `,
    result: [
      { start: 0, end: 1, type: TokenKind.Literal, value: "  " },
      { start: 2, end: 2, type: TokenKind.OpenTag, value: "<" },
      { start: 3, end: 7, type: TokenKind.TagName, value: "style" },
      { start: 8, end: 8, type: TokenKind.WhiteSpace, value: " " },
      { start: 9, end: 12, type: TokenKind.AttrName, value: "lang" },
      { start: 13, end: 13, type: TokenKind.AttrEq, value: "=" },
      { start: 14, end: 14, type: TokenKind.DQuote, value: '"' },
      { start: 15, end: 18, type: TokenKind.AttrValue, value: "scss" },
      { start: 19, end: 19, type: TokenKind.DQuote, value: '"' },
      { start: 20, end: 20, type: TokenKind.OpenTagEnd, value: ">" },
      {
        start: 21,
        end: 42,
        type: TokenKind.Literal,
        value: `
    body{colo</div>;}`,
      },
      { start: 43, end: 50, type: TokenKind.CloseTag, value: "</style>" },
      { start: 51, end: 51, type: TokenKind.Literal, value: " " },
    ],
  },
  {
    ignore: true,
    name: "tokenize html tag with prefixed attrib name",
    input: '<span :id="user.id"/>',
    result: [
      { start: 0, end: 0, type: TokenKind.OpenTag, value: "<" },
      { start: 1, end: 4, type: TokenKind.TagName, value: "span" },
      { start: 5, end: 5, type: TokenKind.WhiteSpace, value: " " },
      { start: 6, end: 8, type: TokenKind.AttrName, value: ":id" },
      { start: 9, end: 9, type: TokenKind.AttrEq, value: "=" },
      { start: 10, end: 10, type: TokenKind.DQuote, value: '"' },
      { start: 11, end: 14, type: TokenKind.Identifier, value: "user" },
      { start: 15, end: 15, type: TokenKind.Dot, value: "." },
      { start: 16, end: 17, type: TokenKind.Identifier, value: "id" },
      { start: 18, end: 18, type: TokenKind.DQuote, value: '"' },
      { start: 19, end: 19, type: TokenKind.VoidTagEnd, value: "/>" },
    ],
  },
  {
    ignore: true,
    name: "tokenize html tag with (if) directive",
    input: '<span (if)="data.users"/>',
    result: [
      { start: 0, end: 0, type: TokenKind.OpenTag, value: "<" },
      { start: 1, end: 4, type: TokenKind.TagName, value: "span" },
      { start: 5, end: 5, type: TokenKind.WhiteSpace, value: " " },
      { start: 6, end: 9, type: TokenKind.AttrName, value: "(if)" },
      { start: 10, end: 10, type: TokenKind.AttrEq, value: "=" },
      { start: 11, end: 11, type: TokenKind.DQuote, value: '"' },
      { start: 12, end: 15, type: TokenKind.Identifier, value: "data" },
      { start: 16, end: 16, type: TokenKind.Dot, value: "." },
      { start: 17, end: 21, type: TokenKind.Identifier, value: "users" },
      { start: 22, end: 22, type: TokenKind.DQuote, value: '"' },
      { start: 23, end: 24, type: TokenKind.VoidTagEnd, value: "/>" },
    ],
  },
  {
    ignore: true,
    name: "tokenize html tag with (loop) directive",
    input: '<span (loop)="data.users as user, i"/>',
    result: [
      { start: 0, end: 0, type: TokenKind.OpenTag, value: "<" },
      { start: 1, end: 4, type: TokenKind.TagName, value: "span" },
      { start: 5, end: 5, type: TokenKind.WhiteSpace, value: " " },
      { start: 6, end: 11, type: TokenKind.AttrName, value: "(loop)" },
      { start: 12, end: 12, type: TokenKind.AttrEq, value: "=" },
      { start: 13, end: 13, type: TokenKind.DQuote, value: '"' },
      { start: 14, end: 17, type: TokenKind.Identifier, value: "data" },
      { start: 18, end: 18, type: TokenKind.Dot, value: "." },
      { start: 19, end: 23, type: TokenKind.Identifier, value: "users" },
      { start: 24, end: 24, type: TokenKind.WhiteSpace, value: " " },
      { start: 25, end: 26, type: TokenKind.Identifier, value: "as" },
      { start: 27, end: 27, type: TokenKind.WhiteSpace, value: " " },
      { start: 28, end: 31, type: TokenKind.Identifier, value: "user" },
      { start: 32, end: 32, type: TokenKind.Comma, value: "," },
      { start: 33, end: 33, type: TokenKind.WhiteSpace, value: " " },
      { start: 34, end: 34, type: TokenKind.Identifier, value: "i" },
      { start: 35, end: 35, type: TokenKind.DQuote, value: '"' },
      { start: 36, end: 37, type: TokenKind.VoidTagEnd, value: "/>" },
    ],
  },
  {
    name: "tokenize expression: simple expression",
    expression: true,
    input: "{   uno.dos}",
    result: [
      { start: 0, end: 0, type: TokenKind.OpenCurly, value: "{" },
      { start: 1, end: 3, type: TokenKind.WhiteSpace, value: "   " },
      { start: 4, end: 6, type: TokenKind.Identifier, value: "uno" },
      { start: 7, end: 7, type: TokenKind.Dot, value: "." },
      { start: 8, end: 10, type: TokenKind.Identifier, value: "dos" },
      { start: 11, end: 11, type: TokenKind.CloseCurly, value: "}" },
    ],
  },
  {
    name: "tokenize expression: simple expression no closer",
    expression: true,
    input: "uno.dos asdf",
    result: [
      { start: 0, end: 2, type: TokenKind.Identifier, value: "uno" },
      { start: 3, end: 3, type: TokenKind.Dot, value: "." },
      { start: 4, end: 6, type: TokenKind.Identifier, value: "dos" },
    ],
  },
  {
    name: "tokenize expression: quoted",
    expression: true,
    input: "{uno.2.'first name'}",
    result: [
      { start: 0, end: 0, type: TokenKind.OpenCurly, value: "{" },
      { start: 1, end: 3, type: TokenKind.Identifier, value: "uno" },
      { start: 4, end: 4, type: TokenKind.Dot, value: "." },
      { start: 5, end: 5, type: TokenKind.Identifier, value: "2" },
      { start: 6, end: 6, type: TokenKind.Dot, value: "." },
      { start: 7, end: 7, type: TokenKind.SQuote, value: "'" },
      { start: 8, end: 17, type: TokenKind.Identifier, value: "first name" },
      { start: 18, end: 18, type: TokenKind.SQuote, value: "'" },
      { start: 19, end: 19, type: TokenKind.CloseCurly, value: "}" },
    ],
  },
];

const onlyTests = tests.filter((test) => test.only);
if (onlyTests.length) tests = onlyTests;
tests.forEach((test) => {
  if (test.ignore) return;
  Deno.test(test.name, () => {
    // if (test.expression) tokenizeExpression(reader);
    if (test.expression) return;
    const tokens = tokenizeHtml(test.input);
    if (test.only) {
      console.log({ results: test.result, tokens, input: test.input });
    }
    assertEquals(tokens, test.result);
  });
});
