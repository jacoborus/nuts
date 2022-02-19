import { compileTag } from '../../src/compiler/compile-tag';
import { TagSchema } from '../../src/types';

test('Compile tag #simple', () => {
  const schema = {
    kind: 'tag',
    name: 'span',
    isVoid: false,
    events: [],
    attributes: [
      {
        kind: 'attribute',
        name: 'id',
        value: 'my-id',
        isBoolean: false,
        dynamic: false,
        reactive: false,
      },
    ],
    children: [
      {
        kind: 'text',
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
