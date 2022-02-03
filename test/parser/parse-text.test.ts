import { parseText } from '../../src/parser/parse-text';

const baseComp = {
  type: 'text',
  data: '',
};

test('Parse#textPlain empty', () => {
  const result = {
    kind: 'text',
    mode: 'plain',
    literal: '',
    variables: [],
  };
  const parsed = parseText(baseComp);
  expect(parsed).toEqual(result);
});

test('Parse#textPlain', () => {
  const result = {
    kind: 'text',
    mode: 'plain',
    literal: 'hola mundo ',
    variables: [],
  };
  const schema = Object.assign({}, baseComp, { data: 'hola mundo ' });
  const parsed = parseText(schema);
  expect(parsed).toEqual(result);
});

test('Parse#textConstant', () => {
  const result = {
    kind: 'text',
    mode: 'constant',
    literal: "counter ${box.count ?? ''}.",
    variables: [],
  };
  const schema = Object.assign({}, baseComp, { data: 'counter {{ count }}.' });
  const parsed = parseText(schema);
  expect(parsed).toEqual(result);
});

test('Parse#textVar', () => {
  const result = {
    kind: 'text',
    mode: 'variable',
    literal: "Fixed ${box.constantino ?? ''} y ${box.valentina ?? ''}",
    variables: ['valentina'],
  };
  const schema = Object.assign({}, baseComp, {
    data: 'Fixed {{ constantino }} y {{: valentina }}',
  });
  const parsed = parseText(schema);
  expect(parsed).toEqual(result);
});
