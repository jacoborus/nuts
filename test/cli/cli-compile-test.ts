import test from 'tape'
import { parseHTML } from '../../src/cli/parse-html'

const input = `
<html>
  <body>
    <h1 id="hello">Hello world</h1>
  </body>
</html>
`
test('CLI compile', t => {
  const schema = parseHTML(input)
  t.ok(schema)
  t.end()
})
