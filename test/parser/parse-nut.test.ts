import { parseNut } from '../../src/parser/parse-nut';

const baseComp = {
  type: 'tag',
  name: 'mynut',
  attribs: {
    id: 'myid',
    ':prop1': 'myProp',
    ':prop2': 'myProp2',
  },
  children: [],
};

test('Parse#nut', () => {
  const { kind, name, props } = parseNut(baseComp);
  expect(kind).toBe('nut');
  expect(name).toBe('mynut');
  const [prop1, prop2] = props;
  expect(prop1).toEqual({
    kind: 'prop',
    propName: 'prop1',
    value: 'myProp',
    variables: ['myProp'],
  });
  expect(prop2).toEqual({
    kind: 'prop',
    propName: 'prop2',
    value: 'myProp2',
    variables: ['myProp2'],
  });
});
