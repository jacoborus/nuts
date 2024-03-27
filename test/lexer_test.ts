import { lexer } from "../src/lexer.ts";
import { Token, TokenKind } from "../src/types.ts";
import { assertEquals } from "https://deno.land/std@0.220.1/assert/mod.ts";

let tests: {
  name: string;
  input: Token;
  ignore?: boolean;
  only?: boolean;
  result: Token[];
  expression?: boolean;
}[] = [
  {
    name: "tokenize html: simple identifier",
    // "name"
    input: { start: 2, end: 5, type: TokenKind.Interpolation, value: "name" },
    result: [
      { start: 2, end: 5, type: TokenKind.Identifier, value: "name" },
    ],
  },
  {
    name: "tokenize html: simple identifier and whitespace",
    // " name "
    input: { start: 0, end: 6, type: TokenKind.Interpolation, value: " name " },
    result: [
      { start: 0, end: 0, type: TokenKind.WhiteSpace, value: " " },
      { start: 1, end: 4, type: TokenKind.Identifier, value: "name" },
      { start: 5, end: 5, type: TokenKind.WhiteSpace, value: " " },
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
    const tokens = lexer(test.input);
    if (test.only) {
      console.log({ results: test.result, tokens, input: test.input });
    }
    assertEquals(tokens, test.result);
  });
});
