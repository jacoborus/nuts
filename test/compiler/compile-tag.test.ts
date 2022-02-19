import { compileTag } from '../../src/compiler/compile-tag';
import { TagSchema } from '../../src/types';

test('Compile tag #simple', () => {
  const schema = {
    type: 'tag',
    name: 'span',
    isVoid: false,
    events: [],
    attributes: [
      {
        type: 'attribute',
        name: 'id',
        value: 'my-id',
        isBoolean: false,
        dynamic: false,
        reactive: false,
      },
    ],
    children: [
      {
        type: 'text',
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
