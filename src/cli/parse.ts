import fs from 'fs';
import path from 'path';
import { parseFile } from '../parser/parse-file';
// import { compileComponent } from '../compiler/compile-component';
const inputPath = path.resolve(process.argv[2]);

const data = fs.readFileSync(inputPath, { encoding: 'utf8', flag: 'r' });
const parsed = parseFile(inputPath, data);
console.log(parsed);
// const pretty = JSON.stringify(parsed, null, 2);
// process.stdout.write(pretty);
// const compiled = compileComponent(parsed);
// fs.writeFileSync('render.js', compiled);

const it = {
  users: [
    {
      name: 'jacobo',
      registered: true,
    },
    {
      name: 'andrea',
      registered: true,
    },
    {
      name: 'teresa',
      registered: true,
    },
    {
      name: 'alberto',
      registered: true,
    },
  ],
};

// console.log(compiled);
