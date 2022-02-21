import { compileAttribs } from '../../src/compiler/compile-attribs';
import { AttSchema, NodeTypes } from '../../src/types';

test('Compile attribs #static', () => {
  const attribs = [
    {
      type: NodeTypes.ATTRIBUTE,
      name: 'id',
      value: 'my-id',
      isBoolean: false,
      dynamic: false,
      reactive: false,
    },
    {
      type: NodeTypes.ATTRIBUTE,
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
      type: NodeTypes.ATTRIBUTE,
      name: 'id',
      value: 'myId',
      isBoolean: false,
      dynamic: true,
      reactive: false,
      expr: [{ scope: 0, value: 'myId' }],
    },
    {
      type: NodeTypes.ATTRIBUTE,
      name: 'hidden',
      value: 'hyde',
      isBoolean: true,
      dynamic: true,
      reactive: false,
      expr: [{ scope: 0, value: 'hyde' }],
    },
    {
      type: NodeTypes.ATTRIBUTE,
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
