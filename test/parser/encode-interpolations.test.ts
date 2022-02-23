import he from 'he';
import {
  parseString,
  mapInterpolations,
} from '../../src/parser/encode-interpolations';

test('parseString', () => {
  const input =
    "testing:\nhola {{ donde.ciudad }} nuts\n y {{ cuando['#<dia'].1 }}";
  const chunks = parseString(input);
  expect(chunks).toEqual([
    {
      value: 'testing:\nhola ',
      original: 'testing:\nhola ',
      interpolation: false,
      loc: {
        line: 1,
        column: 1,
      },
    },
    {
      value: '{{ donde.ciudad }}',
      original: '{{ donde.ciudad }}',
      interpolation: true,
      loc: {
        line: 2,
        column: 6,
      },
    },
    {
      value: ' nuts\n y ',
      original: ' nuts\n y ',
      interpolation: false,
      loc: {
        line: 2,
        column: 24,
      },
    },
    {
      value: '{{ cuando[&#x27;#&#x3C;dia&#x27;].1 }}',
      original: "{{ cuando['#<dia'].1 }}",
      interpolation: true,
      loc: {
        line: 3,
        column: 4,
      },
    },
  ]);
  const generated = mapInterpolations('file', 'source', input, chunks);
  expect(generated.code).toBe(he.encode(input));
  const map = generated.map.toJSON();
  expect(map.sources).toEqual(['source']);
  expect(map.file).toBe('file');
  expect(map.sourcesContent).toEqual([input]);
});
