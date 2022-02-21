import { compileTag } from '../../src/compiler/compile-tag';
import { TagSchema, NodeTypes } from '../../src/types';

test('Compile tag #simple', () => {
  const schema = {
    type: NodeTypes.TAG,
    name: 'span',
    isVoid: false,
    events: [],
    attributes: [
      {
        type: NodeTypes.ATTRIBUTE,
        name: 'id',
        value: 'my-id',
        isBoolean: false,
        dynamic: false,
        reactive: false,
      },
    ],
    children: [
      {
        type: NodeTypes.TEXT,
        value: 'hola',
        dynamic: false,
        reactive: false,
      },
    ],
  };
  const result = '<span id="my-id">hola</span>';
  const compiled = compileTag(schema as TagSchema);
  expect(compiled).toEqual(result);
});
