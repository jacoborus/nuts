export function parseExpression(input: string) {
  let expr = '';
  let fromParent = 0;
  if (input.startsWith('../')) {
    expr = input.slice(3);
    fromParent = 1;
  } else {
    expr = input;
  }
  const split = expr.split('.');
  return split.map((value) => {
    const scope = fromParent;
    fromParent = 0;
    return {
      scope,
      value,
    };
  });
}
