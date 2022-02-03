import test from 'tape';
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

test('Parse#nut', (t) => {
  const { kind, name, props } = parseNut(baseComp);
  t.is(kind, 'nut');
  t.is(name, 'mynut');
  const [prop1, prop2] = props;
  t.same(prop1, {
    kind: 'prop',
    propName: 'prop1',
    value: 'myProp',
    variables: ['myProp'],
  });
  t.same(prop2, {
    kind: 'prop',
    propName: 'prop2',
    value: 'myProp2',
    variables: ['myProp2'],
  });
  t.end();
});
