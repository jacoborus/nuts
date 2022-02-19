import { compileAttribs } from '../../src/compiler/compile-attribs';
import { AttSchema } from '../../src/types';

test('Compile attribs #static', () => {
  const attribs = [
    {
      kind: 'attribute',
      name: 'id',
      value: 'my-id',
      isBoolean: false,
      dynamic: false,
      reactive: false,
    },
    {
      kind: 'attribute',
      name: 'hidden',
      value: 'hyde',
      isBoolean: true,
      dynamic: false,
      reactive: false,
      expr: [],
    },
  ];

  const result = ' id="my-id" hidden';
  const compiled = compileAttribs(attribs as AttSchema[]);
  expect(compiled).toEqual(result);
});

test('Compile attributes #dynamic', () => {
  const attribs = [
    {
      kind: 'attribute',
      name: 'id',
      value: 'myId',
      isBoolean: false,
      dynamic: true,
      reactive: false,
      expr: [{ scope: 0, value: 'myId' }],
    },
    {
      kind: 'attribute',
      name: 'hidden',
      value: 'hyde',
      isBoolean: true,
      dynamic: true,
      reactive: false,
      expr: [{ scope: 0, value: 'hyde' }],
    },
    {
      kind: 'attribute',
      name: 'checked',
      value: 'check',
      isBoolean: true,
      dynamic: true,
      reactive: false,
      expr: [{ scope: 0, value: 'check' }],
    },
  ];
  const result =
    ' id="${it.myId ?? ""}"${it.hyde ? " hidden" : "" }${it.check ? " checked" : "" }';
  const compiled = compileAttribs(attribs as AttSchema[]);
  expect(compiled).toEqual(result);
});
